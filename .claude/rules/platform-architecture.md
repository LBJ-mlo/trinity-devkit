# Platform Architecture — How to manage this platform

## Platform Rules

### Git Push Policy
- Commits are fine at any time
- **Before executing `git push`, you MUST ask the user for explicit permission**
- Never push without user approval — this rule applies to all agents and hooks

## Layer Classification

When adding a new skill, assign it to one of 4 layers:

| Layer | Name | Purpose | Examples |
|-------|------|---------|----------|
| 0 | Meta-Cognition | How to think | comprehensive-thinking |
| 1 | Session Management | How to use Claude Code | using-superpowers, using-much-skills |
| 2 | Engineering Process | How to build software | spec-driven-development, test-driven-development |
| 3 | Execution Utilities | How to dispatch/verify | dispatching-parallel-agents, verification-before-completion |

## Adding a New Skill

1. **Source**: Clone/copy to `.claude/skills/<skill-name>/`
2. **Validate**: Ensure SKILL.md exists with valid YAML frontmatter (name, description)
3. **Classify**: Assign to Layer 0-3 based on its cognitive function
4. **Collision check**: If name conflicts with existing skill:
   - Different purpose → prefix or rename (e.g., `pipeline-tdd`)
   - Improvement → replace old, update all cross-references
   - Overlap → merge into existing, do NOT duplicate
5. **Router registration**: Update `using-much-skills/SKILL.md` quick dispatch table
6. **CLAUDE.md update**: Add to the layered catalog and resolution rules
7. **Hook integration**: If hooks needed, add to `.claude/hooks/hooks.json` (NEVER create separate hooks.json)
8. **Command**: If slash command needed, add `.md` + `.toml` to `.claude/commands/`
9. **Verify**: Start fresh session, confirm skill appears in discovery, test invocation

## Removing a Skill

1. Delete `.claude/skills/<name>/` directory
2. Remove from `using-much-skills/SKILL.md` dispatch table
3. Remove from CLAUDE.md catalog
4. Remove any associated commands or hook entries

## Modifying Upstream Skills

- Do NOT directly edit upstream SKILL.md files (breaks future updates)
- Write override rules in CLAUDE.md instead
- Or fork to `<name>-custom` and update cross-references

## Directory Conventions

- Skills: flat under `.claude/skills/<name>/SKILL.md`
- Agents: `.claude/agents/<name>.md`
- Commands: `.claude/commands/<name>.md` + `<name>.toml`
- Hooks: `.claude/hooks/<name>.sh` + entries in `hooks.json`
- References: `.claude/references/<name>.md`
- Memory: `.claude/memory/<name>.md`
- Rules: `.claude/rules/<name>.md`
