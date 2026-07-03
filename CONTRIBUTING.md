# Contributing to Trinity DevKit

感谢你的关注！以下是贡献方式。

## 提交 Issue

发现 Bug、想提新功能、或建议新增技能？请提交 Issue，描述：
- 你遇到了什么问题
- 你期望的行为是什么
- 相关的环境信息（OS、Claude Code 版本）

## 提交 PR

### 添加新技能

1. 确认技能不在现有 40 个技能的覆盖范围内
2. 遵循 `.claude/rules/platform-architecture.md` 中的 [Adding a New Skill](.claude/rules/platform-architecture.md#adding-a-new-skill) 流程
3. 确保 SKILL.md 有有效的 YAML frontmatter（`name` + `description`）
4. 更新 CLAUDE.md 速查表和 `using-much-skills/SKILL.md` 的 Quick Dispatch 表

### 改进现有整合

1. 先开 Issue 讨论，避免重复劳动
2. 保持改动聚焦 —— 一个 PR 只做一件事
3. 更新相关文档（CLAUDE.md、README.md）

### 代码风格

- 钩子脚本用 bash，兼容 Git Bash (Windows) 和 Unix bash
- Markdown 文件使用中文或英文，保持一致
- JSON 文件使用 2 空格缩进

## 行为准则

- 尊重上游库的原始设计意图
- 不直接修改上游 SKILL.md（用 CLAUDE.md 覆盖规则或 fork 为 `<name>-custom`）
- 冲突解决优先考虑互补而非替代

## 许可

本项目原创内容（CLAUDE.md、using-much-skills、bootstrap.sh 等）使用 MIT 协议。
提交 PR 即表示你同意将你的贡献以 MIT 协议授权。
