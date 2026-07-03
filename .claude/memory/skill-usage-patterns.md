---
name: skill-usage-patterns
description: Emergent skill usage patterns — tracks which skill sequences work best for different task types, updated as patterns emerge
metadata:
  type: reference
---

# Skill Usage Patterns

This file tracks which skill sequences work best for different task types.
Add patterns as they emerge from actual usage.

## Pattern: Architecture Design (New System)
architecture-patterns → domain-driven-design → spec-driven-development → planning-and-task-breakdown

## Pattern: DDD Guided Development
domain-driven-design (strategic: bounded contexts) → domain-driven-design (tactical: aggregates/entities) → architecture-patterns (layer rules) → spec-driven-development → incremental-implementation

## Pattern: Refactoring to Clean Architecture
architecture-patterns → code-review-and-quality (audit current) → planning-and-task-breakdown → incremental-implementation → code-review-and-quality (verify)

## Pattern: Bug Fix
systematic-debugging → debugging-and-error-recovery → pipeline-tdd (gate) → test-driven-development (Prove-It) → verification-before-completion

## Pattern: New Feature (Full Lifecycle)
brainstorming → writing-plans → spec-driven-development → planning-and-task-breakdown → subagent-driven-development → incremental-implementation → test-driven-development (HOW) + pipeline-tdd (GATE) → code-review-and-quality → verification-before-completion → finishing-a-development-branch

## Pattern: Quick Feature (Simple)
spec-driven-development → incremental-implementation → test-driven-development → code-review-and-quality → verification-before-completion

## Pattern: Architecture Decision
comprehensive-thinking → writing-plans → documentation-and-adrs

## Pattern: Production Deploy
shipping-and-launch (fan-out to code-reviewer, security-auditor, test-engineer) → verification-before-completion

## Pattern: Code Review (Receiving)
receiving-code-review → code-review-and-quality → code-simplification

## Pattern: Parallel Multi-Task
writing-plans → planning-and-task-breakdown → dispatching-parallel-agents → verification-before-completion

## Pattern: Skill Creation
writing-skills → (test the skill) → verification-before-completion
