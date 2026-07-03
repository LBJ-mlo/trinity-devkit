---
name: using-much-skills
description: Platform bootstrap — loaded at every session start. The SINGLE entry point for routing and skill discovery. Contains the complete decision tree, skill catalog (42 skills, 4 layers), chain invocation patterns, and conflict resolution rules. Read this first before consulting individual skill files.
---

# Using Much Skills — Platform Bootstrap

## Overview

This project integrates 5 skill libraries into a 4-layer cognitive architecture:

```
Layer 0: Meta-Cognition     → comprehensive-thinking              (HOW to think deeply)
Layer 1: Session Management → using-superpowers                   (HOW to use Claude Code)
Layer 2: Engineering Process → 24 engineering + 2 architecture     (HOW to build software)
Layer 3: Execution Utilities → 13 workflow skills                  (HOW to dispatch/verify)
```

**You only need to read this file.** It contains everything needed to route any task to the right skill.

---

## Core Rules

### Rule 1: Check Skills Before ANY Action
Before responding — even with clarifying questions — check if a skill applies. This is non-negotiable.

### Rule 2: Layer Priority
1. **Complex/ambiguous/high-stakes?** → `comprehensive-thinking` FIRST
2. **Creating features/building things?** → `brainstorming` FIRST, then implementation skills
3. **Engineering tasks** → use the decision tree below
4. **Execution** → invoke workflow skills as needed

### Rule 3: Pipeline Discipline
Non-trivial work follows: brainstorming → plans → spec → tasks → implement (TDD) → review → verify → complete

### Rule 4: TDD is Mandatory
- `test-driven-development` = HOW to TDD (RED-GREEN-REFACTOR, test pyramid, Prove-It)
- `pipeline-tdd` = GATE enforcement (Iron Law: NO code without a failing test)

### Rule 5: Verify Before Claiming Completion
Never say "done"/"fixed"/"passing" without fresh verification evidence.

### Rule 6: Ask Before Pushing
You may commit changes freely. Before executing `git push`, you MUST ask the user for explicit permission. Never push without approval.

---

## Decision Tree

Match EVERY task to the right skill. If unsure, default to the safest option:

```
Task arrives
  │
  ├── Complex/ambiguous/high-stakes decision?    → comprehensive-thinking
  ├── Creative work / new feature / design?       → brainstorming (MUST use before code)
  ├── Need a specification?                       → spec-driven-development
  │     ├── Need architecture pattern selection?  → architecture-patterns
  │     └── Need domain modeling / DDD?           → domain-driven-design
  ├── Have a spec, need to plan?                  → planning-and-task-breakdown
  │     └── Need a written implementation plan?   → writing-plans
  ├── Implementing code?
  │     ├── Full feature implementation            → incremental-implementation
  │     ├── UI/frontend work                       → frontend-ui-engineering
  │     ├── API/interface design                   → api-and-interface-design
  │     ├── Need doc-verified code                 → source-driven-development
  │     ├── Context is messy                       → context-engineering
  │     └── High-stakes / unfamiliar code          → doubt-driven-development
  ├── Writing/running tests?                      → test-driven-development (HOW) + pipeline-tdd (GATE)
  │     └── Browser-based testing?                → browser-testing-with-devtools
  ├── Something broke / unexpected behavior?
  │     └── Bug/failure → systematic-debugging (process)
  │         → debugging-and-error-recovery (tools)
  ├── Reviewing code?
  │     ├── Full review                            → code-review-and-quality
  │     ├── Security concerns                      → security-and-hardening
  │     ├── Performance concerns                   → performance-optimization
  │     ├── Code is too complex                    → code-simplification
  │     ├── Requesting review (your code)          → requesting-code-review
  │     └── Receiving feedback (someone else's)    → receiving-code-review
  ├── Committing / branching / versioning?         → git-workflow-and-versioning
  │     └── Need isolated workspace?               → using-git-worktrees
  ├── CI/CD pipeline work?                         → ci-cd-and-automation
  ├── Deprecating / migrating?                     → deprecation-and-migration
  ├── Writing docs / ADRs?                         → documentation-and-adrs
  ├── Adding logs / metrics / alerts?              → observability-and-instrumentation
  ├── Deploying / launching?                       → shipping-and-launch
  ├── Multiple independent tasks in parallel?      → dispatching-parallel-agents or subagent-driven-development
  ├── About to claim "done"?                       → verification-before-completion
  ├── Finishing a development branch?              → finishing-a-development-branch
  ├── Creating / editing a skill?                  → writing-skills
  └── Browser UI debugging?                        → browser-testing-with-devtools
```

---

## Full Skill Catalog (42 skills)

### Layer 0: Meta-Cognition (1)
- `comprehensive-thinking` — Five-review system for complex decisions

### Layer 1: Session Management (2)
- `using-superpowers` — Discipline: check skills before any action
- `using-much-skills` — This file: full routing + catalog

### Layer 2: Engineering Process (26)

**Define:** `interview-me`, `idea-refine`, `spec-driven-development`
**Plan:** `planning-and-task-breakdown`, `context-engineering`
**Build:** `incremental-implementation`, `test-driven-development`, `source-driven-development`, `doubt-driven-development`, `frontend-ui-engineering`, `api-and-interface-design`
**Architecture:** `architecture-patterns`, `domain-driven-design`
**Verify:** `browser-testing-with-devtools`, `debugging-and-error-recovery`
**Review:** `code-review-and-quality`, `code-simplification`, `security-and-hardening`, `performance-optimization`
**Ship:** `git-workflow-and-versioning`, `ci-cd-and-automation`, `deprecation-and-migration`, `documentation-and-adrs`, `observability-and-instrumentation`, `shipping-and-launch`

### Layer 3: Execution Utilities (13)
`brainstorming`, `writing-plans`, `executing-plans`, `subagent-driven-development`, `dispatching-parallel-agents`, `pipeline-tdd`, `systematic-debugging`, `using-git-worktrees`, `finishing-a-development-branch`, `requesting-code-review`, `receiving-code-review`, `verification-before-completion`, `writing-skills`

---

## Comprehensive-Thinking Triggers

Invoke `comprehensive-thinking` FIRST when user says:
全面思考, 深度理解, 系统性分析, 帮我想清楚, 从根上看, 这件事到底怎么看,
方法论, 复杂问题拆解, 系统方案, 架构判断, 策略判断, 根因分析,
"help me think this through", "analyze this deeply", "think comprehensively"

---

## Chain Invocation Patterns

| Task type | Skill sequence |
|-----------|---------------|
| New feature (full) | brainstorming → spec-driven-development → planning-and-task-breakdown → incremental-implementation → test-driven-development → code-review-and-quality → verification-before-completion |
| New feature (quick) | spec-driven-development → incremental-implementation → test-driven-development → verification-before-completion |
| Bug fix | systematic-debugging → debugging-and-error-recovery → test-driven-development (Prove-It) → verification-before-completion |
| Architecture decision | comprehensive-thinking → architecture-patterns → domain-driven-design → documentation-and-adrs |
| Code review | code-review-and-quality → code-simplification / security-and-hardening |
| Production deploy | shipping-and-launch (fan-out 3 agents) → verification-before-completion |
| DDD development | domain-driven-design (strategic) → domain-driven-design (tactical) → architecture-patterns → spec-driven-development |
| Parallel multi-task | planning-and-task-breakdown → dispatching-parallel-agents → verification-before-completion |
| Skill creation | writing-skills → (test) → verification-before-completion |

---

## Conflict Resolution

| Overlap | Resolution |
|---------|-----------|
| TDD | `test-driven-development` (methodology) + `pipeline-tdd` (gate) |
| Debugging | `systematic-debugging` (process) → `debugging-and-error-recovery` (tools) |
| Code review | `code-review-and-quality` (content) + `requesting-code-review` (workflow) |
| Planning | `writing-plans` (approach) + `planning-and-task-breakdown` (decomposition) |
| Architecture | `architecture-patterns` (pattern selection) + `domain-driven-design` (DDD implementation) |
| Git | `git-workflow-and-versioning` (strategy) + `using-git-worktrees` (isolation) |
