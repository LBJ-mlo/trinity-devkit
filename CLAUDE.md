# Trinity DevKit — AI 辅助开发平台

**Think × Power × Skill** — 5库合一，42技能，4层认知架构。
Home: <https://github.com/LBJ-mlo/trinity-devkit> | 用法: [USAGE.md](USAGE.md) | 评审: [PLATFORM-REVIEW.md](PLATFORM-REVIEW.md)

---

## 1. 平台架构：4层模型

```
Layer 0: 元认知     comprehensive-thinking              "如何深度思考"
Layer 1: 会话引导   using-superpowers, using-much-skills "如何使用 Claude Code"
Layer 2: 工程流程   24个工程技能 + 2个架构知识技能        "如何做好软件工程"
Layer 3: 执行工具   13个工作流技能                        "如何调度验证完成"
```

### 使用规则（优先级从高到低）

1. **复杂/高风险/架构决策？** → 先 `comprehensive-thinking`，再根据结论行动
2. **任何行动前** → 检查技能列表（using-superpowers 纪律）
3. **涉及项目结构/领域建模？** → `architecture-patterns` 或 `domain-driven-design`
4. **工程任务** → 按下面的[决策树](#2-决策树任务匹配)匹配技能
5. **执行中** → 按需调用 Layer 3 工作流技能

---

## 2. 决策树（任务匹配）

收到任务后，按此树匹配技能：

```
任务来了
  ├── 复杂/模糊/高风险？              → comprehensive-thinking
  ├── 需要头脑风暴/探索方案？          → brainstorming
  ├── 新功能/新项目？                 → spec-driven-development
  │     ├── 需要架构选型？             → architecture-patterns
  │     └── 需要领域建模？             → domain-driven-design
  ├── 有规范，需要拆任务？             → planning-and-task-breakdown
  │     └── 要写实现方案？             → writing-plans
  ├── 开始写代码？
  │     ├── 整体实现                  → incremental-implementation
  │     ├── 前端 UI                   → frontend-ui-engineering
  │     ├── API/接口设计              → api-and-interface-design
  │     ├── 需要查官方文档             → source-driven-development
  │     └── 高风险/不熟悉领域          → doubt-driven-development
  ├── 写/跑测试？                     → test-driven-development (方法论)
  │     └── TDD 铁律门禁              → pipeline-tdd (纪律)
  ├── 出 Bug 了？                    → systematic-debugging → debugging-and-error-recovery
  ├── 审查代码？
  │     ├── 全面审查                  → code-review-and-quality
  │     ├── 安全检查                  → security-and-hardening
  │     ├── 性能分析                  → performance-optimization
  │     ├── 简化重构                  → code-simplification
  │     ├── 请求审查 (你写的)          → requesting-code-review
  │     └── 收到审查反馈 (别人审的)     → receiving-code-review
  ├── 提交/分支？                     → git-workflow-and-versioning
  │     └── 隔离开发                  → using-git-worktrees
  ├── CI/CD？                        → ci-cd-and-automation
  ├── 写文档/ADR？                   → documentation-and-adrs
  ├── 加日志/监控/告警？              → observability-and-instrumentation
  ├── 准备发布？                      → shipping-and-launch
  ├── 弃用旧系统/迁移？               → deprecation-and-migration
  ├── 写新技能？                      → writing-skills
  ├── 浏览器相关？                    → browser-testing-with-devtools
  ├── 并行多任务？                    → dispatching-parallel-agents / subagent-driven-development
  ├── 完成前验证？                    → verification-before-completion
  └── 完成开发分支？                  → finishing-a-development-branch
```

---

## 3. 技能目录（42个，按层级）

### Layer 0：元认知（1个）

| 技能 | 触发条件 |
|------|---------|
| `comprehensive-thinking` | 全面思考、深度理解、帮我想清楚、架构判断、策略判断、根因分析、复杂决策 |

### Layer 1：会话引导（2个）

| 技能 | 职责 |
|------|------|
| `using-much-skills` | 平台引导 — 本文件的核心内容，每次会话启动自动注入 |
| `using-superpowers` | 纪律层 — 强制"行动前检查技能"，阻止跳过流程 |

### Layer 2：工程流程

**定义（3个）**
| 技能 | 用武之地 |
|------|---------|
| `interview-me` | 用户自己也不清楚要什么 → 一问一答澄清意图 |
| `idea-refine` | 有粗糙想法 → 发散+收敛产出具体方案 |
| `spec-driven-development` | 开始新功能 → 写结构化规范 |

**规划（2个）**
| 技能 | 用武之地 |
|------|---------|
| `planning-and-task-breakdown` | 规范就绪 → 拆成可执行任务 |
| `context-engineering` | 上下文太长/太乱 → 优化 agent context 结构 |

**构建（6个）**
| 技能 | 用武之地 |
|------|---------|
| `incremental-implementation` | 编码 — 逐片实现、每片验证提交 |
| `source-driven-development` | 需要查官方文档 → fetch→implement→cite |
| `doubt-driven-development` | 高风险/不熟悉 → 对抗性审查每个决策 |
| `frontend-ui-engineering` | 前端 UI — 组件/状态/无障碍 |
| `api-and-interface-design` | API 设计 — 契约/错误/版本 |
| `test-driven-development` | 写测试 — 红绿重构、Prove-It |

**架构知识（2个，跨切面）**
| 技能 | 用武之地 |
|------|---------|
| `architecture-patterns` | Clean/Hexagonal/DDD 范式选型 + 分层规则 |
| `domain-driven-design` | 领域建模 — 战略（限界上下文）+ 战术（聚合/实体） |

**验证（2个）**
| 技能 | 用武之地 |
|------|---------|
| `browser-testing-with-devtools` | 浏览器相关 — Chrome DevTools MCP 运行时验证 |
| `debugging-and-error-recovery` | 出了 Bug — 复现→定位→缩小→修复→加测试 |

**审查（4个）**
| 技能 | 用武之地 |
|------|---------|
| `code-review-and-quality` | 代码审查 — 五轴（正确/可读/架构/安全/性能） |
| `code-simplification` | 代码太复杂 → 简化不改变行为 |
| `security-and-hardening` | 安全检查 — OWASP/STRIDE/输入验证 |
| `performance-optimization` | 性能优化 — 先测量再优化 |

**发布（5个）**
| 技能 | 用武之地 |
|------|---------|
| `git-workflow-and-versioning` | Git 操作 — trunk-based/atomic commits/semver |
| `ci-cd-and-automation` | CI/CD — 质量门禁流水线 |
| `documentation-and-adrs` | 架构决策记录 + 文档 |
| `observability-and-instrumentation` | 日志/指标/追踪/告警 |
| `shipping-and-launch` | 发布上线 — 清单/分阶段/回滚 |
| `deprecation-and-migration` | 弃用旧系统 → 宣布→警告→迁移→移除 |

### Layer 3：执行工具（13个）

| 技能 | 用武之地 |
|------|---------|
| `brainstorming` | 任何创造性工作前 — 必须先有设计再有代码 |
| `writing-plans` | 有规范 → 写实现方案 |
| `executing-plans` | 有计划 → 在独立会话执行 |
| `subagent-driven-development` | 多任务当前会话 → 子代理并行执行 |
| `dispatching-parallel-agents` | 独立任务 → 并行分派子代理 |
| `pipeline-tdd` | TDD 铁律门禁 — 没测试不能写代码 |
| `systematic-debugging` | Bug → 系统化定位根因 |
| `using-git-worktrees` | 隔离开发 → Git worktree |
| `finishing-a-development-branch` | 开发完成 → 合并/PR/清理选项 |
| `requesting-code-review` | 你写的代码 → 请求别人审查 |
| `receiving-code-review` | 收到审查反馈 → 严谨处理反馈 |
| `verification-before-completion` | 声称"完成"前 — 必须有验证证据 |
| `writing-skills` | 写新技能/修改技能 → 开发+测试+部署 |

---

## 4. 技能速查（按场景）

| 场景 | 主技能 | 配合 |
|------|--------|------|
| 🔴 复杂决策 | `comprehensive-thinking` | documentation-and-adrs |
| 🏛️ 架构设计 | `architecture-patterns` | domain-driven-design |
| 🧱 领域建模 | `domain-driven-design` | architecture-patterns |
| 💡 头脑风暴 | `brainstorming` | idea-refine |
| 📝 写规范 | `spec-driven-development` | brainstorming |
| 📋 拆任务 | `planning-and-task-breakdown` | writing-plans |
| 🏗️ 写代码 | `incremental-implementation` | test-driven-development + pipeline-tdd |
| 🐛 修Bug | `systematic-debugging` | debugging-and-error-recovery + test-driven-development |
| 🔍 代码审查 | `code-review-and-quality` | security-and-hardening |
| 📦 多任务并行 | `dispatching-parallel-agents` | subagent-driven-development |
| 🚀 发布上线 | `shipping-and-launch` | verification-before-completion |
| ✍️ 写新技能 | `writing-skills` | verification-before-completion |
| 📖 查文档编码 | `source-driven-development` | context-engineering |
| ⚡ 简化重构 | `code-simplification` | code-review-and-quality |
| 🌐 前端 UI | `frontend-ui-engineering` | browser-testing-with-devtools |
| 🔌 API 设计 | `api-and-interface-design` | spec-driven-development |
| 🔒 安全加固 | `security-and-hardening` | code-review-and-quality |
| ⏱️ 性能优化 | `performance-optimization` | browser-testing-with-devtools |
| 📊 可观测性 | `observability-and-instrumentation` | shipping-and-launch |

---

## 5. 链式调用模式（常见工作流序列）

```
新功能开发:
  brainstorming → spec-driven-development → planning-and-task-breakdown
  → incremental-implementation → test-driven-development → code-review-and-quality
  → verification-before-completion

架构设计:
  comprehensive-thinking → architecture-patterns → domain-driven-design
  → documentation-and-adrs

Bug 修复:
  systematic-debugging → debugging-and-error-recovery
  → test-driven-development (Prove-It) → verification-before-completion

代码审查:
  code-review-and-quality → (code-simplification | security-and-hardening)
  → requesting-code-review / receiving-code-review

发布上线:
  shipping-and-launch (fan-out: code-reviewer + security-auditor + test-engineer)
  → verification-before-completion → finishing-a-development-branch

DDD 建模编码:
  domain-driven-design (战略) → domain-driven-design (战术)
  → architecture-patterns → spec-driven-development → incremental-implementation

并行多任务:
  planning-and-task-breakdown → dispatching-parallel-agents
  → (测试通过后) → verification-before-completion
```

---

## 6. 冲突解决

| 重叠 | 方案 |
|------|------|
| TDD | `test-driven-development` 管"怎么写" + `pipeline-tdd` 管"必须写" |
| 调试 | `systematic-debugging` 管"流程" + `debugging-and-error-recovery` 管"工具" |
| 审查 | `code-review-and-quality` 管"内容" + `requesting-code-review` 管"流程" |
| 规划 | `writing-plans` 管"方案" + `planning-and-task-breakdown` 管"拆解" |
| Git | `git-workflow-and-versioning` 管"策略" + `using-git-worktrees` 管"隔离" |
| 架构 | `architecture-patterns` 管"选范式" + `domain-driven-design` 管"DDD落地" |

---

## 7. comprehensive-thinking 触发词

用户说以下任一词语时，**必须先调用 `comprehensive-thinking`**：

`全面思考` `深度理解` `系统性分析` `帮我想清楚` `从根上看` `这件事到底怎么看`
`方法论` `复杂问题拆解` `系统方案` `架构判断` `策略判断` `根因分析`
`help me think this through` `analyze this deeply` `think comprehensively`

---

## 8. 斜杠命令（9个）

| 命令 | 等同于 |
|------|--------|
| `/spec` | 启动 spec-driven-development 写规范 |
| `/plan` | 启动 planning-and-task-breakdown 拆任务 |
| `/build [auto]` | 增量实现（auto=一口气干完） |
| `/test` | TDD 红绿重构 |
| `/review` | 五轴代码审查 |
| `/code-simplify` | 简化代码 |
| `/ship` | 发布检查（并行三审查） |
| `/webperf` | Web 性能审计 |
| `/think <问题>` | comprehensive-thinking 五重审视 |

---

## 9. Agent 角色（4个）

| 角色 | 专长 |
|------|------|
| `code-reviewer` | 五轴审查（正确/可读/架构/安全/性能） |
| `security-auditor` | 安全审计（OWASP/STRIDE/威胁建模） |
| `test-engineer` | 测试工程（覆盖率/策略/质量分析） |
| `web-performance-auditor` | Web 性能（CWV/加载/渲染/网络） |

---

## 10. 平台管理

### 添加技能
1. 放入 `.claude/skills/<name>/SKILL.md`（必须有 `name` + `description` YAML frontmatter）
2. 判断归属 Layer 0-3
3. 检查是否与现有技能冲突 → 冲突则改名或合并
4. 更新本文第2节（决策树）和第3节（技能目录）
5. 若需钩子，追加到 `.claude/hooks/hooks.json`
6. 重启会话验证

### 修改技能
- **不要直接改**上游 SKILL.md（影响 `git pull` 更新）
- 在本文写覆盖规则，或 fork 为 `<name>-custom`

### 删除技能
- 删除目录 → 从本文移除 → 清理关联命令/钩子

详见 `.claude/rules/platform-architecture.md`

---

## 11. 项目约定

### Always
- 行动前检查技能列表（using-superpowers 纪律）
- 写代码前先写测试（pipeline-tdd 铁律）
- 验证通过才能说"完成"（verification-before-completion）
- 复杂决策用 comprehensive-thinking

### Ask First
- 删除文件 / 改外部依赖 / 改变架构方向 / 安装新技能

### Never
- 跳过测试直接写实现 / 声称完成但不验证
- 假设需求不确认 / 改不理解其目的的代码
- **未经明确同意执行 git push** — 推送前必须先征得用户同意

---

## 12. 故障排除速查

| 问题 | 检查 |
|------|------|
| 技能未自动触发 | `which jq`、`cat .claude/hooks/hooks.json`、重启会话 |
| 两个技能冲突 | 参考第6节[冲突解决](#6-冲突解决)，手动指定 |
| 模型不知道该用哪个技能 | 直接说场景（"帮我审查代码"），不需要指定技能名 |
| 技能用错了 | 直接说"不用这个，用 xxx" |
| 42个技能太多不知道怎么选 | 你不需要选——说人话，模型自动匹配。详见 [USAGE.md](USAGE.md) |
