# 推荐安装的技能清单

以下技能填补了平台评审中发现的覆盖缺口。安装后技能总数从 42 增加到 44-46。

## 数据库设计（推荐 2 选 1）

### 选项 A：`database-patterns`（推荐）

```bash
# 来源：yonatangross/orchestkit (MIT)
# 覆盖：Alembic migrations, schema design, indexing, normalization, NoSQL patterns
git clone --depth 1 https://github.com/yonatangross/orchestkit.git /tmp/orchestkit
cp -r /tmp/orchestkit/skills/database-patterns .claude/skills/database-patterns
rm -rf /tmp/orchestkit
```

### 选项 B：`discover-database`（更全面但更大）

```bash
# 来源：rand-cc/polymath-skills (MIT, v4.0)
# 覆盖：19个子技能 — PostgreSQL/MongoDB/Redis schema, migrations, ORM, pooling
git clone --depth 1 https://github.com/rand-cc/polymath-skills.git /tmp/polymath
cp -r /tmp/polymath/skills/discover-database .claude/skills/discover-database
rm -rf /tmp/polymath
```

## 认证/授权（推荐 1 个）

### `auth-patterns`

```bash
# 覆盖：JWT(access+refresh), OAuth2+PKCE, bcrypt, RBAC, rate limiting, session management
# 来源：需要找到合适的 GitHub 仓库或者自己编写
# 如果找不到现成的，可以让我帮你用 writing-skills 写一个
```

### 备选：使用 `security-and-hardening` 的认证部分

如果暂时不想加新的，现有的 `security-and-hardening` 技能覆盖了认证安全检查（OWASP、输入验证、密码哈希），但缺少认证实现的**流程指导**（JWT 签发/刷新、OAuth 流程、RBAC 设计）。

---

## 安装后的操作

每装一个技能后：

```bash
# 1. 验证 SKILL.md 格式
head -5 .claude/skills/<skill-name>/SKILL.md

# 2. 更新 CLAUDE.md 决策树和技能目录
# 3. 更新 using-much-skills/SKILL.md 的 Quick Dispatch 表
# 4. 重启 Claude Code

# 5. 测试：说"帮我设计用户认证系统"
```

---

## 完整技能地图（安装后预计 44-46 个）

```
Layer 0: 元认知 (1)           comprehensive-thinking
Layer 1: 会话管理 (2)          using-much-skills, using-superpowers
Layer 2: 工程流程 (28-29)
  ├─ 定义 (3)                 interview-me, idea-refine, spec-driven-development
  ├─ 规划 (2)                 planning-and-task-breakdown, context-engineering
  ├─ 构建 (6)                 incremental-implementation, test-driven-development,
  │                           source-driven-development, doubt-driven-development,
  │                           frontend-ui-engineering, api-and-interface-design
  ├─ 架构 (2)                 architecture-patterns, domain-driven-design
  ├─ 数据 (1-2) ★NEW          database-patterns 或 discover-database
  ├─ 验证 (2)                 browser-testing-with-devtools, debugging-and-error-recovery
  ├─ 审查 (4)                 code-review-and-quality, code-simplification,
  │                           security-and-hardening, performance-optimization
  ├─ 认证 (0-1) ★NEW          auth-patterns
  └─ 发布 (6)                 git-workflow-and-versioning, ci-cd-and-automation,
                              deprecation-and-migration, documentation-and-adrs,
                              observability-and-instrumentation, shipping-and-launch
Layer 3: 执行工具 (13)         brainstorming, writing-plans, executing-plans, ...
```
