---
name: platform-conventions
description: Always-active operating behaviors for the much_skills platform — the irreducible core that must never be violated
metadata:
  type: project
---

# Platform Conventions (always active)

## Non-Negotiable Behaviors

1. **Surface assumptions** before implementing non-trivial work
2. **STOP when confused** — name the confusion, don't guess
3. **Push back** on approaches with clear problems — cite concrete downsides
4. **Verify with evidence**, never "seems right"
5. **Maintain scope discipline** — touch only what's asked
6. **No code without a spec** for non-trivial work
7. **No spec without brainstorming** for non-trivial features
8. **No completion without verification**
9. **Ask before git push** — commits are fine, but pushing to remote must be explicitly approved by the user first.

## Pipeline (session scope)

brainstorming → plans → subagents → execute → test → verify → complete

## Layer Awareness

- Meta-cognition triggers (全面思考 etc.) → load [[comprehensive-thinking-triggers]]
- Implementation → consult `using-agent-skills` decision tree
- Methodology → consult `using-superpowers` pipeline

## Key Skills

- How to TDD: `test-driven-development` (methodology) + `pipeline-tdd` (gate)
- How to debug: `systematic-debugging` (process) + `debugging-and-error-recovery` (tools)
- How to review: `code-review-and-quality` (content) + `requesting-code-review` (workflow)
