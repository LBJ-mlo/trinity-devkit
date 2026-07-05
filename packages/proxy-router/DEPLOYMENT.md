# Trinity Router 部署指南

本指南记录了从零开始部署到成功跑通的全过程，包含踩过的所有坑。

## 一、前置要求

- Node.js 18+
- DeepSeek API Key（[platform.deepseek.com](https://platform.deepseek.com)）
- Windows/macOS/Linux

## 二、安装步骤

### 1. 创建配置文件

将 `.env.example` 复制为 `.env`，填入你的密钥：

```
DEEPSEEK_API_KEY=sk-你的密钥
```

`.env` 文件在 `.gitignore` 中，不会被提交。

### 2. 修改 Claude Code 全局配置

**这是最关键的一步。** 编辑 `~/.claude/settings.json`（Windows: `C:\Users\<用户名>\.claude\settings.json`），修改 `env` 段：

```json
{
  "env": {
    "ANTHROPIC_AUTH_TOKEN": "任何值都可以（代理不校验）",
    "ANTHROPIC_BASE_URL": "http://localhost:8888",
    "ANTHROPIC_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_SMALL_FAST_MODEL": "deepseek-v4-pro"
  }
}
```

**⚠️ 关键注意点：**

| 配错 | 后果 | 正确值 |
|------|------|--------|
| `BASE_URL` 带 `/v1` 尾巴 | 请求变 `localhost:8888/v1/v1/messages` → 404 | `http://localhost:8888` |
| `BASE_URL` 仍指向 DeepSeek | 绕过代理直连，代理收不到请求 | 必须指向 `localhost` |
| `MODEL` 写了代理不认识的模型名 | Claude Code 报 "model may not exist" | 写 `deepseek-v4-pro`（代理会映射） |

**为什么 Claude Code 不改模型名？**
- 代理会**自动做模型名映射**——Claude Code 发 `deepseek-v4-pro`，代理按任务类型实际调用 `deepseek-v4-flash` 或 `deepseek-v4-pro`
- 代理在返回响应时会**把模型名改回** Claude Code 期望的名字，否则 Claude Code 检测到模型名不匹配会报错
- 所以你**永远不需要改 Claude Code 的 MODEL 配置**

### 3. 启动代理

```bash
cd packages/proxy-router
node server.js
```

看到这个启动画面即成功：

```
╔══════════════════════════════════════════════╗
║     🧠 Trinity Router — Anthropic协议       ║
║  端口: 8888                                  ║
║  端点: http://localhost:8888/v1/messages     ║
╚══════════════════════════════════════════════╝
```

### 4. 重启 Claude Code

**注意：必须完全关闭 VSCode，不是 Reload Window。** 关闭所有 VSCode 窗口后重新打开。

在 Claude Code 中说"你好"，看代理终端是否打印路由日志：

```
🏷️  LLM分类: "chat" → 实际模型: deepseek-v4-flash
🚀 [CHAT] → DeepSeek Flash (deepseek-v4-flash) | "你好..."
📤 后端返回 HTTP 200, model=N/A
✅ 模型名已修正: → deepseek-v4-pro
```

有 `HTTP 200` + Claude Code 正常回复 = 成功。

---

## 三、工作原理

```
Claude Code（配置永远不动）
    │ 发送 Anthropic 格式请求
    │ ANTHROPIC_BASE_URL = http://localhost:8888
    ▼
┌─────────────────────────────┐
│    Trinity Router (:8888)   │
│                             │
│  1. 接收 Anthropic 请求     │
│  2. LLM 分类任务类型        │
│     ├── chat     → Flash    │
│     ├── planning → Pro      │
│     └── coding   → Pro      │
│  3. 用实际模型转发到后端     │
│  4. 响应 model 名改回原值    │
└──────────┬──────────────────┘
           │
     ┌─────┴──────┐
     ▼            ▼
  DeepSeek     DeepSeek
  Flash        Pro
```

### 关键设计

| 问题 | 为什么 | 解决方案 |
|------|--------|---------|
| Claude Code 报 "model may not exist" | 响应 model 名和请求不一致 | 响应 model 名改回原始值 |
| 代理收不到请求 | BASE_URL 仍指向 DeepSeek | 确认 `~/.claude/settings.json` 改了 |
| 代理收到请求但后端 404 | URL 拼接错误 | DeepSeek Anthropic 端点 = `.../anthropic/v1/messages` |
| 代理收到请求但路径重复 `/v1/v1/` | BASE_URL 多写了 `/v1` | BASE_URL = `http://localhost:8888` (不要 `/v1`) |
| VSCode Reload 不生效 | VSCode 缓存旧配置 | 完全关闭 VSCode 再打开 |

### URL 拼接详解

```
BASE_URL:          http://localhost:8888
Claude Code添加:    /v1/messages?beta=true
实际请求:           http://localhost:8888/v1/messages?beta=true ✅

如果 BASE_URL = http://localhost:8888/v1:
实际请求:           http://localhost:8888/v1/v1/messages?beta=true ❌
```

---

## 四、多模型扩展指南

### 架构原理

代理支持**无限模型接入**。核心机制：

```
Claude Code ──→ 代理 ──→ 路由表（routes.js）──→ 各种模型
  /model xxx       │                              ├─ DeepSeek Flash
  随便切 ✅       │   LLM 分类器                  ├─ DeepSeek Pro
  (代理自动适配)    │   判断任务类型                ├─ GLM-4
                   │                              ├─ Claude Sonnet
                   └─── 响应 model 名自动修正 ──── ├─ Qwen
                                                    └─ DeepSeek R1
```

- Claude Code `/model` 切什么模型名，代理都自动接受
- 路由分类**不依赖**你把 Claude Code 设成什么模型名
- 代理在响应中把模型名修正回 Claude Code 请求的名字，永远不报错

### 添加新模型（3 步）

以接入 **Claude Sonnet** 做代码审查为例：

#### 第 1 步：在 `routes.js` 加路由条目

```javascript
const ROUTE_CONFIG = {
  // ... 现有路由 ...

  review: {
    name: 'Claude Sonnet',                              // 日志显示名
    model: 'claude-sonnet-4-20250514',                   // 实际调用的模型名
    baseUrl: 'https://api.anthropic.com/v1',             // API 地址
    description: '代码审查 — Claude 审查质量高',
    keywords: ['审查', 'review', '代码质量', '安全检查'],
  },
};
```

**各字段说明：**

| 字段 | 作用 | 示例 |
|------|------|------|
| `name` | 日志中显示的名字 | `'DeepSeek Pro'` |
| `model` | 转发给 API 时用的模型名 | `'deepseek-v4-pro'` |
| `baseUrl` | API 地址（不带 `/messages`） | `'https://api.deepseek.com/anthropic/v1'` |
| `description` | 注释说明 | 随意写 |
| `keywords` | 关键词兜底（LLM分类失败时用） | `['设计', '架构']` |

#### 第 2 步：改分类器 Prompt

在 `CLASSIFIER_PROMPT` 里加一行，告诉路由 LLM 什么情况下选新模型：

```javascript
const CLASSIFIER_PROMPT = `你是一个任务分类器...

输出规则（只输出一个词，不要解释）：

planning — 分析、设计、架构、规划、评审、解释、评估、思考
coding   — 编写代码、修改代码、重构、调试、实现功能、修复bug
review   — 代码审查、安全检查、质量审计、第三方视角检查    ← 新增
chat     — 简单问答、闲聊、问候`;
```

#### 第 3 步：设置 API Key

在 `.env` 中加新模型的密钥：

```bash
# 现有的
DEEPSEEK_API_KEY=sk-xxx

# 新增的
ANTHROPIC_API_KEY=sk-ant-xxx   # Claude 用
GLM_API_KEY=xxx                 # GLM 用
```

然后在 `server.js` 顶部读取：

```javascript
const ANTHROPIC_KEY = process.env.ANTHROPIC_API_KEY;   // 新增
```

在 `routeToBackend` 函数中匹配 Key：

```javascript
const apiKeyMap = {
  'DeepSeek Pro': DEEPSEEK_KEY,
  'DeepSeek Flash': DEEPSEEK_KEY,
  'GLM-4': GLM_KEY,
  'Claude Sonnet': ANTHROPIC_KEY,     // 新增
};
const apiKey = apiKeyMap[target.name];
```

### 常见模型接入速查表

| 模型 | `baseUrl` | `model` 字段 | 协议 | 需要 Key |
|------|-----------|-------------|------|---------|
| DeepSeek | `https://api.deepseek.com/anthropic/v1` | `deepseek-v4-pro` | Anthropic | `DEEPSEEK_API_KEY` |
| DeepSeek R1 | `https://api.deepseek.com/beta` | `deepseek-reasoner` | Anthropic | `DEEPSEEK_API_KEY` |
| GLM-4 | `https://open.bigmodel.cn/api/paas/v4` | `glm-4-plus` | OpenAI（代理自动转换） | `GLM_API_KEY` |
| Claude Sonnet | `https://api.anthropic.com/v1` | `claude-sonnet-4-20250514` | Anthropic 原生 | `ANTHROPIC_API_KEY` |
| Qwen | `https://dashscope.aliyuncs.com/compatible-mode/v1` | `qwen-max` | OpenAI（代理自动转换） | `QWEN_API_KEY` |

> **注意：** 代理目前**分类器用 DeepSeek 的 Anthropic 协议**。如果你关了 DeepSeek 或没设 `DEEPSEEK_API_KEY`，会自动退化为关键词匹配（不需要任何 API 调用）。想用其他模型做分类器，修改 `classifyWithLLM` 函数即可。

### 模型名透传机制（已验证）

```
你在 Claude Code 里: /model claude-haiku-4-5-20251001
                                             ↓
Claude Code 发请求:  model = "claude-haiku-4-5-20251001"
                                             ↓
代理: 你叫什么无所谓，我按分类结果选后端模型
                                             ↓
后端返回:          response.model = "deepseek-v4-flash"（和请求不匹配）
                                             ↓
代理修正:          response.model = "claude-haiku-4-5-20251001" ✅
                                             ↓
Claude Code:       模型名匹配，不报错 ✅
```

**结论：你可以在 Claude Code 里随便 `/model` 切任何模型名，代理自动处理，不会报错。**

### 分类器用哪个模型

默认用 DeepSeek 做分类（`classifyWithLLM` 函数）。想换成其他模型：

1. 在 `.env` 设 `CLASSIFIER_API_KEY` 和 `CLASSIFIER_BASE_URL`
2. 修改 `classifyWithLLM` 函数中的 API 调用

或者不依赖任何 LLM——删掉 `classifyWithLLM` 调用，直接用 `keywordFallback`，零成本路由（仅靠关键词匹配，精度略低但完全免费）。

---

## 五、故障排除

### 代理终端没有任何请求日志

- **检查1：** `curl http://localhost:8888/health` — 代理是否在运行？
- **检查2：** `grep ANTHROPIC_BASE_URL ~/.claude/settings.json` — 是否指向 localhost？
- **检查3：** 完全关闭 VSCode → 重新打开 → 新建 Claude Code 会话

### 日志显示 `HTTP 404`

后端 URL 不对。检查：
- `routes.js` 中 planning/coding 的 `baseUrl` 
- DeepSeek 的 Anthropic 端点必须是 `https://api.deepseek.com/anthropic/v1`（带 `/v1`）

### 日志显示 `HTTP 401` 或 `HTTP 403`

API Key 问题：
- DeepSeek Key：`sk-xxx` 格式，从 platform.deepseek.com 复制
- 确认 `.env` 文件在 `packages/proxy-router/` 目录下
- `.env` 格式：`KEY=value`，不要加引号（或引号会被自动去掉）

### Claude Code "There's an issue with the selected model"

- 确认 `~/.claude/settings.json` 中 `ANTHROPIC_MODEL` 是 `deepseek-v4-pro`
- 代理中 `ROUTE_CONFIG[chat|planning|coding].model` 是 DeepSeek 支持的模型名
- 代理代码中响应 model 名修正逻辑未生效

### 代理日志显示请求内容为 `[{"tool_use_id":...}]`

不是错误。Claude Code 的 Anthropic protocol 会把整个对话历史（含工具调用结果）作为 content array 发送。代理正确解析了最后一条 user 消息做分类。

---

## 六、配置回退

如果代理出问题想恢复直接连 DeepSeek：

```json
// ~/.claude/settings.json 改回：
"ANTHROPIC_BASE_URL": "https://api.deepseek.com/anthropic"
```

改完重启 VSCode 即可恢复。
