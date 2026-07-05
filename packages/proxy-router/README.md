# Trinity Router — LLM 智能路由代理

**LLM 驱动的模型路由器：自动判断任务类型，转发给最合适的模型。**

```
Claude Code ──→ localhost:8888 ──→ chat      → DeepSeek Flash (日常对话)
                                 ├─→ planning  → DeepSeek Pro  (分析设计)
                                 └─→ coding    → DeepSeek Pro  (编码实现)
```

Claude Code 配置**永远不需要改**。代理帮你做智能路由，切换模型也不会报错。

## 快速开始

### 1. 前置要求

- Node.js 18+
- DeepSeek API Key（[platform.deepseek.com](https://platform.deepseek.com)）

### 2. 配置

```bash
cd packages/proxy-router
cp .env.example .env
# 编辑 .env，填入你的 API Key
```

### 3. 配置 Claude Code

编辑 `~/.claude/settings.json`（Windows: `C:\Users\<用户名>\.claude\settings.json`）：

```json
{
  "env": {
    "ANTHROPIC_BASE_URL": "http://localhost:8888",
    "ANTHROPIC_MODEL": "deepseek-v4-pro",
    "ANTHROPIC_SMALL_FAST_MODEL": "deepseek-v4-flash"
  }
}
```

> ⚠️ **不要**在 URL 后面加 `/v1`。Claude Code 会自动拼接。

### 4. 启动代理

```bash
node server.js
# 或 Windows 双击 start.cmd
```

### 5. 重启 VSCode

**完全关闭 VSCode，重新打开**（Reload Window 不够）。

在 Claude Code 中说"你好"，代理终端应显示：

```
🏷️  LLM分类: "chat" → 实际模型: deepseek-v4-flash
🚀 [CHAT] deepseek-v4-pro → DeepSeek Flash (deepseek-v4-flash) | "你好..."
📤 后端返回 HTTP 200
✅ 模型名已修正: → deepseek-v4-pro
```

## 工作原理

```
Claude Code 请求 → 代理 (localhost:8888)
                      │
                      ├── LLM 分类器判断任务类型 (~200 tokens，几乎免费)
                      │
                      ├── [chat]     → DeepSeek Flash (便宜快速)
                      ├── [planning] → DeepSeek Pro  (推理强)
                      └── [coding]   → DeepSeek Pro  (代码强)
                      │
                      └── 响应 model 名自动修正（匹配 Claude Code 期望）
```

代理协议：**Anthropic Messages API**（原生兼容 Claude Code，无需格式转换）。

## 特性

| 特性 | 说明 |
|------|------|
| **智能路由** | LLM 分析任务类型，自动选择模型 |
| **模型透传** | Claude Code 里 `/model` 随便切，代理自动适配不报错 |
| **多模型扩展** | 想加 Claude、GLM、Qwen → 改一行 `routes.js` 配置 |
| **零依赖** | 纯 Node.js 标准库，不需要 `npm install` |
| **关键词兜底** | LLM 分类失败或没配 Key → 自动降级为关键词匹配（免费） |

## 自定义路由

编辑 `routes.js`：

```javascript
// 例：把编码任务切到 GLM-4
coding: {
    name: 'GLM-4',
    model: 'glm-4-plus',
    baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
    keywords: ['实现', '代码', '编写', ...],
},

// 例：新增代码审查路由
review: {
    name: 'Claude Sonnet',
    model: 'claude-sonnet-4-20250514',
    baseUrl: 'https://api.anthropic.com/v1',
    keywords: ['审查', 'review', '安全检查', ...],
},
```

详细步骤见 [DEPLOYMENT.md](DEPLOYMENT.md)。

## 验证

```bash
# 代理是否在运行
curl http://localhost:8888/health
# → {"status":"ok","uptime":123.45}

# 查看路由配置
curl http://localhost:8888/routes

# 查看可用模型列表
curl http://localhost:8888/v1/models
```

## 故障排除

| 问题 | 检查 |
|------|------|
| 代理没日志 | `~/.claude/settings.json` 里 `ANTHROPIC_BASE_URL` 指向 localhost 了吗？ |
| HTTP 404 | `routes.js` 里 `baseUrl` 末尾是否带了正确的 `/v1` 路径？ |
| HTTP 401/403 | `.env` 里的 API Key 是否正确？格式：`KEY=value` |
| "model may not exist" | VSCode 完全关闭重开了吗？`ANTHROPIC_MODEL` 是代理模型列表里的值吗？ |
| 路由不准 | 编辑 `routes.js` 中 `CLASSIFIER_PROMPT` 的分类标准 |

**完整排查指南 → [DEPLOYMENT.md](DEPLOYMENT.md)**
