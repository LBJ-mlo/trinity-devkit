---
name: using-much-skills
description: Platform bootstrap — loaded at every session start. Establishes the 4-layer skill architecture and routing rules for all 39+ integrated skills.
---

# Using Much Skills — Platform Bootstrap

## Overview

This project integrates 3 skill libraries across 4 cognitive layers:

```
Layer 0: Meta-Cognition     → comprehensive-thinking    (how to THINK deeply)
Layer 1: Session Management → using-superpowers         (how to USE Claude Code)
Layer 2: Engineering Process → using-agent-skills        (how to BUILD software)
Layer 3: Execution Utilities → superpowers workflow skills (how to DISPATCH, VERIFY)
```

## Core Rules (Always Active)

### Rule 1: Check Skills Before Action
Before ANY response — including clarifying questions or file reads — check if a skill applies. This is non-negotiable.

### Rule 2: Layer Priority
When multiple skills apply, higher layers take priority:
- **Layer 0 first**: Is this complex/ambiguous/high-stakes? → `comprehensive-thinking`
- **Layer 1 always**: The superpowers pipeline is always active as guardrail
- **Layer 2 by phase**: Use the agent-skills decision tree for engineering tasks
- **Layer 3 on demand**: Workflow skills invoked as needed during execution

### Rule 3: Pipeline Discipline
Non-trivial features MUST follow the pipeline:
```
brainstorming → writing-plans → (spec-driven-development) → (planning-and-task-breakdown)
→ subagent-driven-development → incremental-implementation
→ test-driven-development (HOW) + pipeline-tdd (GATE)
→ code-review-and-quality → verification-before-completion
→ finishing-a-development-branch
```
Parenthesized steps are from agent-skills; others are from superpowers.

### Rule 4: TDD is Mandatory
- `test-driven-development` (agent-skills): Tells you HOW to write tests (RED-GREEN-REFACTOR, test pyramid, Prove-It pattern)
- `pipeline-tdd` (superpowers): Enforces THAT you must write tests first (Iron Law: NO code without a failing test)

### Rule 5: Verify Before Claiming Completion
Never claim work is "done", "fixed", or "passing" without fresh verification evidence.

## Trigger Words for comprehensive-thinking

When the user says any of these, invoke `comprehensive-thinking` FIRST:
全面思考, 深度理解, 系统性分析, 帮我想清楚, 从根上看, 这件事到底怎么看,
方法论, 复杂问题拆解, 系统方案, 架构判断, 策略判断, 根因分析,
"help me think this through", "analyze this deeply", "think comprehensively"

## Quick Dispatch

| What you need | Primary skill |
|---------------|--------------|
| Think deeply about a complex problem | `comprehensive-thinking` |
| Brainstorm / design before code | `brainstorming` |
| Write an implementation plan | `writing-plans` |
| Break down work into tasks | `planning-and-task-breakdown` |
| Dispatch parallel subagents | `dispatching-parallel-agents` or `subagent-driven-development` |
| Implement code | `incremental-implementation` |
| Write tests first | `test-driven-development` (how) + `pipeline-tdd` (gate) |
| Debug systematically | `systematic-debugging` then `debugging-and-error-recovery` |
| Review code | `code-review-and-quality` |
| Request/receive review | `requesting-code-review` / `receiving-code-review` |
| Simplify code | `code-simplification` |
| Security audit | `security-and-hardening` |
| Performance optimize | `performance-optimization` |
| Ship to production | `shipping-and-launch` |
| Verify completion | `verification-before-completion` |
| Write a new skill | `writing-skills` |
| Git workflow | `git-workflow-and-versioning` / `using-git-worktrees` |

## Resolution Rules for Overlapping Skills

| Situation | Which skill |
|-----------|------------|
| TDD needed | `test-driven-development` for methodology, `pipeline-tdd` for gate enforcement |
| Debugging | `systematic-debugging` for process, `debugging-and-error-recovery` for tool-specific |
| Code review | `code-review-and-quality` for content, `requesting-code-review` for workflow |
| Planning | `writing-plans` for approach, `planning-and-task-breakdown` for task decomposition |
| Git | `git-workflow-and-versioning` for strategy, `using-git-worktrees` for isolation |
