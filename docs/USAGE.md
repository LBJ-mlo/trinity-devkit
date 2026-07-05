# Trinity DevKit 用法指南

## 目录

1. [第一天：装上就能用](#第一天装上就能用)
2. [理解平台：4层怎么工作](#理解平台4层怎么工作)
3. [场景1：从零开始一个新功能](#场景1从零开始一个新功能)
4. [场景2：修一个Bug](#场景2修一个bug)
5. [场景3：审查代码](#场景3审查代码)
6. [场景4：做架构决策](#场景4做架构决策)
7. [场景5：多人协作](#场景5多人协作)
8. [斜杠命令速查](#斜杠命令速查)
9. [常见对话模式](#常见对话模式)
10. [故障排除](#故障排除)

---

## 第一天：装上就能用

### 安装（30秒）

```bash
git clone https://github.com/LBJ-mlo/trinity-devkit.git my-project
cd my-project
code .   # 用 VSCode 打开
```

安装 `jq`（钩子依赖，仅一次）：

```bash
# macOS
brew install jq

# Windows
winget install jqlang.jq

# Linux
sudo apt install jq
```

### 验证安装

打开 Claude Code（`Cmd/Ctrl + Shift + P` → `Claude Code: Open`），输入：

```
你现在有哪些技能可用？
```

模型应该回复类似：

```
我当前加载了 Trinity DevKit 平台，包含 42 个技能，分为 4 层：

Layer 0 (元认知): comprehensive-thinking
Layer 1 (会话管理): using-superpowers, using-much-skills
Layer 2 (工程流程): spec-driven-development, test-driven-development, ...
Layer 3 (执行工具): brainstorming, verification-before-completion, ...
```

如果只列出部分技能或没反应，说明 `jq` 没装或 hooks.json 未生效。参见[故障排除](#故障排除)。

### 第一个任务

试试直接说一句话：

```
帮我审查一下 CLAUDE.md 这个文件
```

模型会自动调用 `code-review-and-quality`，从正确性、可读性、架构、安全、性能五个维度给出审查报告。

**关键体验：你不需要知道"要用哪个技能"，直接说你想做什么就行。**

---

## 理解平台：4层怎么工作

### 你不需要记住 42 个技能名

平台在启动时自动把技能架构注入模型上下文。当你说话时，模型内部发生的事：

```
你说："帮我设计一下用户系统的架构"
        │
        ▼
Layer 1 (纪律)     检查是否有适用技能 → 有！comprehensive-thinking 和 architecture-patterns
        │
        ▼
Layer 0 (思考)     是否复杂/高风险？→ 是，先启动 comprehensive-thinking 五重审视
        │
        ▼
Layer 2 (工程)     审视结论：需要先做架构选型 → 调用 architecture-patterns
        │
        ▼
Layer 2 (工程)     架构定下来了 → 调用 spec-driven-development 写规范
        │
        ▼
Layer 3 (执行)     需要记录架构决策 → 调用 documentation-and-adrs
```

你只需要说人话，技能链自动匹配。

### 什么时候可以省略技能？

- 简单问题（"这个变量名是什么意思"）→ 直接回答，不需要技能
- 单行修改（"把这里的 30 改成 60"）→ 直接改
- 纯询问（"这段代码是干嘛的"）→ 直接解释

如果模型过度使用技能（比如对简单问题启动了 comprehensive-thinking），直接说"不用那么复杂，直接改就行"。

---

## 场景1：从零开始一个新功能

### 完整对话示例

**你：** 我要做一个用户登录功能，用户名+密码登录，要有"记住我"选项。

**模型（内部：启动 brainstorming）：**
> 在开始实现之前，让我先和你确认几个问题：
> 1. 用户数据存哪里？数据库还是文件？
> 2. 需要注册功能吗？还是只有登录？
> 3. 前后端分离还是全栈？
> 4. 有什么安全要求？（密码加密、限流、Session管理）

**你：** SQLite 数据库，需要注册，前后端分离，密码要 bcrypt 加密，Session 用 JWT。

**模型（内部：brainstorming → writing-plans → spec-driven-development）：**
> 好的，我先写一份规范。核心内容：
> - POST /api/auth/register (username, password) → JWT token
> - POST /api/auth/login (username, password, remember_me) → JWT token
> - bcrypt 密码哈希，JWT 有效期 24h（remember_me=7d）
> - SQLite 存储用户表
>
> 保存到 SPEC.md，你看一下有没有问题？

**你：** 可以，继续。

**模型（内部：spec-driven-development → planning-and-task-breakdown）：**
> 拆成 5 个任务：
> 1. 数据库 schema + User model
> 2. 注册 API + bcrypt 密码哈希
> 3. 登录 API + JWT 签发
> 4. 前端登录表单 + 状态管理
> 5. 集成测试 + 错误处理
>
> 任务清单已保存到 tasks/todo.md。从 Task 1 开始？

**你：** 开始吧。

**模型（内部：incremental-implementation + test-driven-development）：**
> **[Task 1: 数据库 Schema]**
>
> 先写测试（RED）：
> ```javascript
> it('creates users table with required columns', ...);
> it('enforces unique username constraint', ...);
> ```
> 确认测试失败 → 实现 schema → 测试通过。
>
> **[Task 2: 注册 API]**
> ...

### 这个过程中调用了哪些技能？

```
brainstorming          → 探索需求，确认范围
writing-plans          → 制定实现方案
spec-driven-development → 编写结构化规范
planning-and-task-breakdown → 拆解为5个任务
incremental-implementation  → 逐个任务增量实现
test-driven-development     → 每个任务先写测试再写代码
code-review-and-quality     → 完成后审查
verification-before-completion → 确认所有测试通过
```

**你不需要手动调用任何一个。** 整个过程自然对话即可。

---

## 场景2：修一个Bug

### 完整对话示例

**你：** 用户列表页，搜索中文名字搜不出来。

**模型（内部：systematic-debugging）：**
> 让我系统性地定位这个问题。先确认几个事实：
> 1. 搜索英文名正常吗？
> 2. 是前端搜还是后端搜？
> 3. 数据库里这条中文记录确实存在吗？

**你：** 英文正常，后端 SQL 搜索，数据库里有这条记录。

**模型：**
> 用 Prove-It 模式，先写一个复现测试（RED）：
> ```javascript
> it('searches Chinese names correctly', async () => {
>   const result = await searchUsers('张三');
>   expect(result).toContainEqual(
>     expect.objectContaining({ name: '张三' })
>   );
> });
> ```
>
> 测试果然失败了。检查发现 SQL 查询没有设置 `PRAGMA case_sensitive_like`，
> 而且用了 `LIKE` 而不是 ICU 排序。修复 → 测试通过。

### 这里调用的是哪层技能？

```
systematic-debugging          → 系统化定位根因（Layer 3）
debugging-and-error-recovery  → 具体调试步骤（Layer 2）
test-driven-development       → Prove-It 模式写复现测试（Layer 2）
verification-before-completion → 确认修好了（Layer 3）
```

---

## 场景3：审查代码

### 对话示例

**你：** 帮我审查一下 src/auth/ 目录下的代码。

**模型（内部：code-review-and-quality）：**
> ## Code Review: src/auth/
>
> ### Correctness ✅
> - 密码哈希正确使用了 bcrypt，盐值轮数 12
> - ⚠️ JWT secret 从环境变量读取，但没有 fallback 检查
>
> ### Architecture ⚠️
> - 认证逻辑和用户 CRUD 混在同一个 service 里，建议分离
> - 中间件和业务逻辑的边界清晰，这部分做得不错
>
> ### Security 🔴
> - **Critical:** `/register` 端点无限流保护，存在暴力注册风险
> - JWT 未设置过期时间
>
> ### 建议
> 1. **[Critical]** 给 `/register` 和 `/login` 加 rate limiting
> 2. **[Required]** JWT 加 `expiresIn` 配置
> 3. **[Optional]** 把 auth service 拆成 AuthService + UserService

### 如果想更深入

```
# 只看安全问题
帮我做 security-and-hardening 审查 src/auth/

# 只看性能
帮我审查 src/api/ 的性能问题

# 简化代码
帮我简化 src/utils/helpers.js
```

---

## 场景4：做架构决策

### 对话示例

**你：** 帮我想清楚：我现在这个单体应用要不要拆成微服务？

**模型（内部：comprehensive-thinking 触发）：**
> **[第一重审视：问题与领域]**
> 深层目标不是"要不要拆"，而是"如何支撑未来18个月的业务增长和团队扩展"。
> 关键问题改写为：当前单体架构在18个月内的瓶颈在哪里？微服务化是否为最优解？
>
> **[第二重审视：大师理论体系]**
> 引入 Martin Fowler 的微服务先决条件理论、Sam Newman 的《Building Microservices》...
>
> ...（展开五重审视）...
>
> **[最终判断]**
> 当前团队 3 人、用户量 <10 万、业务边界不清晰——微服务为时过早。
> 建议先做 Modular Monolith：模块间接口清晰，团队 10+ 人时再拆分。
> 推荐下一步动作：识别限界上下文（bounded contexts），用 domain-driven-design 建模。

### 你还可以这样问

```
帮我想清楚：这个系统应该用 React 还是 Vue？
从根上看：为什么我们的 CI 总是慢？
全面思考：这个第三方 API 要不要替换成自研的？
```

**触发词（自动识别）：** 帮我想清楚、全面思考、深度理解、系统性分析、架构判断、策略判断、根因分析、从根上看

---

## 场景5：多人协作

### 审查别人提的 PR

**你：** 帮我审查 PR #42

模型自动：
1. 用 `code-review-and-quality` 做五轴审查
2. 用 `security-and-hardening` 检查安全问题
3. 用 `verification-before-completion` 确认测试覆盖

### 并行多任务

**你：** 同时做三件事：审查前端代码、审计后端安全、检查测试覆盖率

模型内部调用 `dispatching-parallel-agents`，同时启动三个子代理：
- 子代理1：code-reviewer 审查前端
- 子代理2：security-auditor 审计后端
- 子代理3：test-engineer 分析覆盖率

三个审查并行跑，最后汇总给你一个完整报告。

### 隔离开发（Git Worktree）

**你：** 我要重构用户模块，不想影响当前工作区

模型调用 `using-git-worktrees`，自动创建隔离的 Git worktree，在独立空间里重构，不会弄乱你的工作区。

---

## 斜杠命令速查

| 命令 | 什么时候用 | 等同于说什么 |
|------|-----------|-------------|
| `/spec` | 开始新项目/新功能 | "帮我写规范" |
| `/plan` | 规范好了，要拆任务 | "把这个规范拆成任务" |
| `/build [auto]` | 开始写代码（auto=一口气干完） | "按任务清单实现" |
| `/test` | 写测试 | "用 TDD 方式写" |
| `/review` | 合并前审查 | "帮我审查代码" |
| `/code-simplify` | 代码太复杂，想简化 | "简化这段代码" |
| `/ship` | 准备发布 | "发布前检查一下" |
| `/webperf` | 优化 Web 性能 | "分析页面性能" |
| `/think` | 复杂问题深度思考 | "帮我想清楚这个决策" |

---

## 常见对话模式

### 启动新项目
```
"我要做一个 <项目描述>，你帮我从零开始规划"
→ brainstorming → spec-driven-development → planning-and-task-breakdown
```

### 写功能
```
"帮我实现 <功能描述>，要写测试"
→ incremental-implementation → test-driven-development
```

### 修Bug
```
"<Bug 描述>，帮我看看怎么回事"
→ systematic-debugging → debugging-and-error-recovery → test-driven-development (Prove-It)
```

### 改代码
```
"把 <文件> 的 <描述> 改成 <新行为>"
→ incremental-implementation → test-driven-development
```

### 审代码
```
"审查一下 <文件/PR>"
→ code-review-and-quality
```

### 发布前
```
"准备发布了"
→ shipping-and-launch → verification-before-completion
```

### 深度决策
```
"帮我想清楚 <复杂问题>"
→ comprehensive-thinking → documentation-and-adrs
```

### 架构设计
```
"这个系统的架构怎么设计"
→ architecture-patterns → domain-driven-design → documentation-and-adrs
```

---

## 故障排除

### 技能没有被自动识别

**症状：** 说"帮我审查代码"，模型没有调用 code-review-and-quality。

**检查：**
```bash
# 1. jq 装了吗？
which jq

# 2. hooks.json 存在吗？
cat .claude/hooks/hooks.json

# 3. bootstrap.sh 可执行吗？
bash .claude/hooks/bootstrap.sh
```

### SessionStart 钩子没有触发

重启 Claude Code 会话（`/clear` 或关闭重开）。SessionStart 只在启动/clear/compact 时触发。

### 两个技能被同时触发怎么办？

正常现象。比如你说"帮我写一个登录功能"，可能同时触发 brainstorming（需求探索）和 spec-driven-development（写规范）。模型会按优先级处理：brainstorming 先 → spec 后。

### 技能用错了怎么办？

直接告诉模型："不用这个技能，用 `xxx` 代替。"

### 想让模型记住项目约定

编辑 CLAUDE.md，在"项目约定"部分写你的自定义规则。每次会话启动都会自动加载。

### 技能太多不知道怎么选？

**你不需要选。** 说你想做什么，模型自动匹配。如果你确实想手动指定：

```
用 code-review-and-quality 审查 src/auth/
用 comprehensive-thinking 帮我分析这个架构
```
