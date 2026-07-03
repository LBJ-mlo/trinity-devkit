#!/bin/bash
# much_skills unified platform bootstrap
# Injects the 4-layer platform architecture into every new session
# Merges: using-much-skills (platform) + using-superpowers (discipline)

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
SKILLS_DIR="$(dirname "$SCRIPT_DIR")/skills"

PLATFORM_SKILL="$SKILLS_DIR/using-much-skills/SKILL.md"
SUPERPOWERS_SKILL="$SKILLS_DIR/using-superpowers/SKILL.md"

if ! command -v jq >/dev/null 2>&1; then
  echo '{"priority": "INFO", "message": "much_skills: jq is required but not found. Install jq to enable platform bootstrap. Skills remain available individually."}'
  exit 0
fi

# Build the combined bootstrap message
PLATFORM_CONTENT=""
SP_CONTENT=""

if [ -f "$PLATFORM_SKILL" ]; then
  PLATFORM_CONTENT=$(cat "$PLATFORM_SKILL")
fi

if [ -f "$SUPERPOWERS_SKILL" ]; then
  SP_CONTENT=$(cat "$SUPERPOWERS_SKILL")
fi

# Construct unified message
MESSAGE="much_skills Platform Bootstrap — 4-Layer Architecture Active

=== PLATFORM ARCHITECTURE ===
$PLATFORM_CONTENT

=== DISCIPLINE RULES (superpowers) ===
$SP_CONTENT"

jq -cn \
  --arg message "$MESSAGE" \
  '{priority: "IMPORTANT", message: $message}'
