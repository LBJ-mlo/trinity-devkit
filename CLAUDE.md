# Trinity DevKit — AI 辅助开发平台

**Think × Power × Skill** — 三库合一，40 个技能，4 层认知架构的统一开发平台。
Home: <https://github.com/LBJ-mlo/trinity-devkit>

## 平台架构：4 层认知模型

```
Layer 0: 元认知层     → comprehensive-thinking          "如何深度思考复杂问题"
Layer 1: 会话引导层   → using-superpowers               "如何使用 Claude Code"
Layer 2: 工程流程层   → using-agent-skills → 24个技能    "如何做好软件工程"
Layer 3: 执行工具层   → superpowers 工作流技能           "如何调度、验证、完成"
```

### 使用规则（优先级从高到低）

1. **复杂/高风险问题？** → 先调用 `comprehensive-thinking`（五重审视），再根据结论进入工程流程
2. **任何行动前** → 检查是否有适用技能（using-superpowers 纪律）
3. **工程任务** → 按开发阶段用 agent-skills 决策树匹配技能
4. **执行中** → 按需调用 superpowers 工作流技能（brainstorming、subagent-driven-development 等）

## 技能速查表

| 场景 | 主技能 | 配合技能 |
|------|--------|---------|
| 🔴 复杂决策/架构判断 | `comprehensive-thinking` | documentation-and-adrs |
| 💡 需求头脑风暴 | `brainstorming` | idea-refine |
| 📝 写规范 | `spec-driven-development` | brainstorming |
| 📋 拆任务 | `planning-and-task-breakdown` | writing-plans |
| 🏗️ 写代码 | `incremental-implementation` | test-driven-development + pipeline-tdd |
| 🐛 修Bug | `systematic-debugging` | debugging-and-error-recovery + test-driven-development |
| 🔍 代码审查 | `code-review-and-quality` | code-simplification / security-and-hardening |
| 📦 多任务并行 | `dispatching-parallel-agents` | subagent-driven-development |
| 🚀 发布上线 | `shipping-and-launch` | verification-before-completion |
| ✍️ 写新技能 | `writing-skills` | verification-before-completion |

## TDD 双技能机制

| | `test-driven-development` | `pipeline-tdd` |
|---|---|---|
| **来源** | agent-skills | superpowers（改名） |
| **职责** | **怎么做** TDD（红绿重构、测试金字塔、Prove-It） | **必须做** TDD（铁律：没测试=不写代码） |
| **层级** | Layer 2（方法论） | Layer 1（纪律门禁） |

## 技能冲突解决

| 重叠场景 | 用哪个 |
|---------|--------|
| TDD | `test-driven-development`（方法）+ `pipeline-tdd`（门禁） |
| 调试 | `systematic-debugging`（流程）+ `debugging-and-error-recovery`（工具） |
| 代码审查 | `code-review-and-quality`（内容）+ `requesting-code-review`（流程） |
| 规划 | `writing-plans`（方案）+ `planning-and-task-breakdown`（拆解） |
| Git | `git-workflow-and-versioning`（策略）+ `using-git-worktrees`（隔离） |

## 斜杠命令（9个）

| 命令 | 功能 |
|------|------|
| `/spec` | 规范驱动开发 |
| `/plan` | 任务拆解 |
| `/build [auto]` | 增量实现（auto=自主模式） |
| `/test` | TDD 红绿重构 |
| `/review` | 五轴代码审查 |
| `/code-simplify` | 简化代码 |
| `/ship` | 发布检查（并行审查） |
| `/webperf` | Web 性能审计 |
| `/think` | 触发全面思考（五重审视） |

## Agent 角色（4个）

- `code-reviewer` — 代码审查（正确性/可读性/架构/安全/性能）
- `security-auditor` — 安全审计（OWASP/威胁建模）
- `test-engineer` — 测试工程（覆盖率/策略）
- `web-performance-auditor` — Web 性能审计

## 平台管理

### 添加新技能
1. 放入 `.claude/skills/<name>/SKILL.md`（必须有 YAML frontmatter: name + description）
2. 判断归属 Layer 0-3
3. 检查与现有技能是否冲突 → 冲突则改名或合并
4. 更新本文的技能速查表和冲突解决表
5. 若需要钩子，追加到 `.claude/hooks/hooks.json`
6. 重启会话验证

### 修改上游技能
- **不要直接改**原始 SKILL.md（影响后续更新）
- 在本文写覆盖规则，或 fork 为 `<name>-custom`

### 删除技能
- 删除目录 + 从本文速查表中移除 + 清理关联命令/钩子

详见 `.claude/rules/platform-architecture.md`

## 项目约定

### Always（始终）
- 行动前检查技能列表
- 写代码前先写测试（pipeline-tdd 铁律）
- 验证通过才能声称完成（verification-before-completion）
- 复杂决策用 comprehensive-thinking（五重审视）

### Ask First（先确认）
- 删除文件 / 修改外部依赖 / 改变架构方向
- 安装新技能 / 修改上游 SKILL.md

### Never（禁止）
- 跳过测试直接写实现
- 声称完成但不验证
- 假设用户需求而不确认
- 修改不理解其目的的代码
