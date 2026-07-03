# 🧠 Trinity DevKit

<p align="center">
  <strong>Think × Power × Skill — 三库合一，40+技能的 AI 辅助开发平台</strong>
</p>

<p align="center">
  <a href="#快速开始"><strong>快速开始</strong></a> ·
  <a href="#架构设计"><strong>架构设计</strong></a> ·
  <a href="#技能速查"><strong>技能速查</strong></a> ·
  <a href="#使用示例"><strong>使用示例</strong></a> ·
  <a href="#扩展指南"><strong>扩展指南</strong></a>
</p>

---

## 这是什么？

**Trinity DevKit** 将三个顶尖的开源 AI Agent 技能库融合到一个**4层认知架构**中，让 Claude Code 从"能写代码"进化为"能系统化地完成软件工程"。

```
┌──────────────────────────────────────────────────┐
│  Layer 0  元认知     comprehensive-thinking       │
│           "复杂问题如何思考"   五重审视深度分析      │
├──────────────────────────────────────────────────┤
│  Layer 1  会话引导   using-superpowers            │
│           "如何使用 Claude Code"  强制性技能纪律    │
├──────────────────────────────────────────────────┤
│  Layer 2  工程流程   agent-skills (24个技能)       │
│           "如何做好软件工程"  规范→拆解→编码→审查→发布│
├──────────────────────────────────────────────────┤
│  Layer 3  执行工具   superpowers (14个技能)        │
│           "如何高效调度验证"  并行代理/Git/审查流程   │
└──────────────────────────────────────────────────┘
```

### 你得到什么？

- 🧠 **深度思考能力** — 复杂架构决策时有结构化的五重审视框架
- 🔒 **工程纪律保证** — 没写测试就不能写代码，没验证就不能说完成
- 📐 **完整工程流程** — 从需求访谈到发布上线的每一步都有 SOP
- ⚡ **高效执行模式** — 并行代理调度、Git Worktree 隔离、自动审查门禁

---

## 快速开始

### 前置要求

| 工具 | 用途 | 安装 |
|------|------|------|
| [Claude Code](https://docs.anthropic.com/en/docs/claude-code) | AI Agent | VSCode 扩展 或 `npm i -g @anthropic-ai/claude-code` |
| Git Bash | Windows 钩子运行环境 | `winget install Git.Git` |
| `jq` | JSON 处理（钩子依赖） | `winget install jqlang.jq` / `brew install jq` |

### 安装 (30秒)

```bash
# 1. 克隆仓库
git clone https://github.com/LBJ-mlo/trinity-devkit.git
cd trinity-devkit

# 2. 用 Claude Code 打开此目录
claude
```

**完成！** SessionStart 钩子会在每次新会话启动时自动注入平台引导信息。模型立即感知全部 40 个技能。

### 验证安装

在 Claude Code 会话中输入：

```
你现在有哪些技能可用？
```

模型应列出 4 层架构和 40 个技能。如果没列出，检查：
1. `jq` 是否已安装且在 PATH 中
2. `.claude/hooks/hooks.json` 是否存在且语法正确

---

## 使用方式

### 日常对话（自动匹配技能）

直接用自然语言描述任务，模型会自动匹配合适的技能：

```
你：帮我审查这段代码
模型：[调用 code-review-and-quality] 从正确性/可读性/架构/安全/性能五个维度审查...

你：这个 bug 帮我看看
模型：[调用 systematic-debugging] 先系统化定位根因，再修复...

你：帮我想清楚这个架构方案
模型：[调用 comprehensive-thinking] 启动五重审视...第一重审视：定义关键问题...
```

### 斜杠命令（快捷入口）

| 命令 | 功能 | 适用场景 |
|------|------|---------|
| `/spec` | 写结构化规范 | 新功能/新项目启动 |
| `/plan` | 拆解任务 | 规范完成，需要可执行的计划 |
| `/build [auto]` | 增量实现 | 逐片编码，每片验证后提交 |
| `/test` | TDD 红-绿-重构 | 写测试→实现→重构 |
| `/review` | 五轴代码审查 | 合并前质量把关 |
| `/code-simplify` | 简化代码 | 降低复杂度，不改变行为 |
| `/ship` | 发布前检查 | 并行审查 + 通过/不通过决策 |
| `/webperf` | Web 性能审计 | Core Web Vitals 分析 |
| `/think` | 全面思考 | 复杂问题五重审视深度分析 |

### 完整功能开发流程

```
用 /think 想清楚架构
      ↓
用 /spec 写规范
      ↓
用 /plan 拆任务
      ↓
用 /build auto 逐片实现  ← 自动走 TDD + 增量提交
      ↓
用 /review 五轴审查
      ↓
用 /code-simplify 精简代码
      ↓
用 /ship 发布上线
```

---

## 技能速查

### Layer 0: 元认知（1个）

| 技能 | 何时触发 | 来源 |
|------|---------|------|
| `comprehensive-thinking` | 全面思考、深度理解、系统性分析、架构判断、策略判断、根因分析 | comprehensive-thinking |

### Layer 1: 会话引导（2个）

| 技能 | 职责 |
|------|------|
| `using-much-skills` | 平台引导 — 每次会话启动自动注入，建立4层架构认知 |
| `using-superpowers` | 纪律层 — 强制"行动前检查技能"，阻止跳过流程 |

### Layer 2: 工程流程（24个，来自 agent-skills）

**定义阶段**
`interview-me` · `idea-refine` · `spec-driven-development`

**规划阶段**
`planning-and-task-breakdown` · `context-engineering`

**构建阶段**
`incremental-implementation` · `test-driven-development` · `source-driven-development` · `doubt-driven-development` · `frontend-ui-engineering` · `api-and-interface-design`

**验证阶段**
`browser-testing-with-devtools` · `debugging-and-error-recovery`

**审查阶段**
`code-review-and-quality` · `code-simplification` · `security-and-hardening` · `performance-optimization`

**发布阶段**
`git-workflow-and-versioning` · `ci-cd-and-automation` · `deprecation-and-migration` · `documentation-and-adrs` · `observability-and-instrumentation` · `shipping-and-launch`

### Layer 3: 执行工具（13个，来自 superpowers）

`brainstorming` · `writing-plans` · `executing-plans` · `subagent-driven-development` · `dispatching-parallel-agents` · `pipeline-tdd`（TDD 纪律门禁） · `systematic-debugging` · `using-git-worktrees` · `finishing-a-development-branch` · `requesting-code-review` · `receiving-code-review` · `verification-before-completion` · `writing-skills`

### TDD 双技能机制

| | `test-driven-development` | `pipeline-tdd` |
|---|---|---|
| 来源 | agent-skills | superpowers（改名） |
| 职责 | **怎么做** TDD | **必须做** TDD |
| 内容 | 红绿重构、测试金字塔、Prove-It、DAMP/DRY | 铁律：没测试=不写代码，HARD-GATE |
| 关系 | 互补，同时使用 |

### Agent 角色（4个）

| 角色 | 用途 |
|------|------|
| `code-reviewer` | 代码审查（正确性/可读性/架构/安全/性能） |
| `security-auditor` | 安全审计（OWASP/威胁建模/STRIDE） |
| `test-engineer` | 测试工程（覆盖率/策略/质量） |
| `web-performance-auditor` | Web 性能审计（CWV/加载/渲染/网络） |

---

## 架构设计

### 设计哲学

三个库分别解决了 AI 辅助开发中不同层面的问题：

```
comprehensive-thinking  →  "AI 的思考质量太低，结论不可信"
superpowers            →  "AI 会偷懒跳过流程，需要纪律约束"
agent-skills           →  "AI 不知道好的工程实践长什么样"
```

Trinity DevKit 把它们整合为**分层调度**模型：上游管下游，每层有明确的输入输出。

### 关键设计决策

**为什么有两个 TDD 技能？**
`test-driven-development` 教你怎么写好测试，`pipeline-tdd` 确保你不会跳过测试。一个教方法论，一个做纪律门禁 — 缺一不可。

**为什么有两个路由技能？**
`using-superpowers` 管"行动前必须检查技能"（纪律），`using-agent-skills` 管"当前任务应该用哪个技能"（选择）。纪律+选择=可靠的自动匹配。

**为什么不用子目录分类？**
Claude Code 的技能发现机制依赖扁平结构。逻辑分层通过 CLAUDE.md 定义，不依赖文件系统。

### 冲突解决

| 冲突 | 方案 |
|------|------|
| 两个 TDD 技能同名 | agent-skills 保留原名，superpowers 改名 `pipeline-tdd` |
| 两个 SessionStart 钩子 | 合并到 `bootstrap.sh`，先注入平台架构再注入纪律规则 |
| 两个路由机制 | 共存，using-superpowers（纪律）包 using-agent-skills（选择） |

---

## 项目结构

```
trinity-devkit/
│
├── CLAUDE.md                      # 🔑 平台中枢 — 技能速查、冲突解决、管理规则
├── README.md                      # 本文件
├── LICENSE                        # MIT（平台原创）+ 第三方协议声明
├── CONTRIBUTING.md                # 贡献指南
├── .gitignore
│
├── .claude/
│   ├── settings.json              # 权限和自动化配置
│   ├── settings.local.json        # 个人覆盖配置（gitignored）
│   │
│   ├── skills/                    # 40 个技能（扁平结构）
│   │   ├── using-much-skills/     # ★ 平台统一引导（本项目的核心创新）
│   │   ├── comprehensive-thinking/
│   │   ├── using-superpowers/     # superpowers 纪律引导
│   │   ├── using-agent-skills/    # agent-skills 决策树
│   │   ├── pipeline-tdd/          # superpowers TDD（改名）
│   │   ├── test-driven-development/  # agent-skills TDD
│   │   ├── brainstorming/
│   │   ├── subagent-driven-development/
│   │   ├── spec-driven-development/
│   │   └── ... (其他 33 个技能)
│   │
│   ├── agents/                    # 4 个专家 Agent 角色
│   ├── commands/                  # 9 个斜杠命令定义
│   ├── hooks/                     # 统一钩子系统
│   │   ├── hooks.json             # 合并的钩子配置
│   │   ├── bootstrap.sh           # ★ 启动引导脚本（注入平台架构）
│   │   └── ... (SDD缓存、simplify-ignore等)
│   │
│   ├── memory/                    # 持久化平台约定
│   │   ├── MEMORY.md
│   │   ├── platform-conventions.md
│   │   └── skill-usage-patterns.md
│   │
│   ├── references/                # 8 个参考清单
│   └── rules/                     # 2 个管理规则
│       ├── platform-architecture.md
│       └── skills-contributing.md
```

---

## 扩展指南

### 添加新技能

```bash
# 1. 放入技能目录
git clone <skill-repo-url> .claude/skills/<skill-name>

# 2. 确保 SKILL.md 有 YAML frontmatter
head -3 .claude/skills/<skill-name>/SKILL.md
# 应该输出:
# ---
# name: <skill-name>
# description: <触发条件>

# 3. 判断归属 Layer 0-3（参考上面的分层表）
# 4. 检查与现有技能冲突 → 冲突则改名或合并
# 5. 更新 CLAUDE.md 速查表
# 6. 若需钩子，追加到 .claude/hooks/hooks.json
# 7. 重启 Claude Code 验证
```

### 自定义技能行为

**不要直接修改**上游 SKILL.md（影响后续 `git pull` 更新）。改用以下方式：

```markdown
# 在 CLAUDE.md 中写覆盖规则
## Custom: 简化代码时额外检查
修改 code-simplification 的流程：在简化前，先用 comprehensive-thinking 分析是否过度设计
```

或 fork 一份：

```bash
cp -r .claude/skills/code-simplification .claude/skills/code-simplification-custom
# 修改 custom 版本的 SKILL.md，更新 CLAUDE.md 速查表
```

### 更新上游技能

```bash
cd .claude/skills/<skill-name>
git pull
# 检查更新是否影响你的自定义覆盖（CLAUDE.md 中）
```

详见 [.claude/rules/platform-architecture.md](.claude/rules/platform-architecture.md)

---

## 常见问题

<details>
<summary><strong>Q: 40个技能，模型会不会选择困难？</strong></summary>

不会。因为：
1. **SessionStart 钩子**在每次会话启动时注入平台引导，模型知道何时用哪个
2. **两个路由技能**逐级缩小范围：using-superpowers（先检查）→ using-agent-skills（决策树匹配）
3. 每个 SKILL.md 的 `description` 字段就是**触发条件**，只有匹配时才加载
4. 99%的情况下用户无需手动选择 — 自然语言描述任务即可自动匹配
</details>

<details>
<summary><strong>Q: 能在其他 AI Agent 工具中用吗？</strong></summary>

本平台为 **Claude Code** 设计，充分利用了其 SessionStart 钩子注入和 Skill 工具机制。

部分技能可在其他工具中手动使用：
- **Cursor**: 将 SKILL.md 内容复制到 `.cursor/rules/`
- **Codex**: superpowers 和 comprehensive-thinking 原生支持 Codex
- **Gemini CLI**: superpowers 原生支持

但完整的分层架构和自动引导注入仅在 Claude Code 中生效。
</details>

<details>
<summary><strong>Q: 不想要某个技能，怎么删？</strong></summary>

```bash
rm -rf .claude/skills/<skill-name>
# 然后编辑 CLAUDE.md，从速查表中删除对应行
```
</details>

<details>
<summary><strong>Q: 和直接用原版三个库有什么区别？</strong></summary>

直接用原版的痛点：
- 不知道哪个库的哪个技能适用于当前任务
- 两个 TDD 技能同名冲突
- 两个路由机制互相不知道对方存在
- SDD 缓存、simplify-ignore 等钩子需手动配置

Trinity DevKit 解决了这些问题：
- 统一引导注入使模型感知全部技能
- TDD 冲突已解决（改名+互补定位）
- 钩子已预配置
- 添加了 `using-much-skills` 统一引导层
</details>

---

## 致谢

- [**Addy Osmani**](https://github.com/addyosmani) — [agent-skills](https://github.com/addyosmani/agent-skills) (MIT) · 24个工程技能
- [**Jesse Vincent**](https://github.com/obra) — [superpowers](https://github.com/obra/superpowers) (MIT) · 14个工作流技能
- [**元臻**](https://github.com/syzkillall) — [comprehensive-thinking](https://github.com/syzkillall/comprehensive-thinking-skill) (Apache 2.0) · 深度思考框架

---

<p align="center">
  <sub>Trinity DevKit 原创内容使用 MIT 协议 · 集成技能保留各自原始协议</sub>
</p>
