// ─── LLM 分类器的 System Prompt ─────────────────
const CLASSIFIER_PROMPT = `你是任务分类器，将用户消息分为三类。只输出一个词。

## 三类定义

planning — 需要深度推理、多维度权衡的事项：
  · 系统/数据库/API 的设计和架构
  · 代码审查、安全审计、性能分析、方案评估
  · 需求分析、业务建模、技术选型
  · 理解分析现有代码（非修改）："这段代码做什么" "为什么这样实现"
  · 策略规划、风险评估、优先级排序
  · 文档编写（README、ADR、设计文档）

coding — 需要动手产出或修改代码的事项：
  · 编写新代码：实现功能、生成 API、写组件、写脚本
  · 修改现有代码：重构、修复 bug、打补丁
  · 调式定位后动手修复
  · 优化代码性能（要改代码）
  · 写测试用例

chat — 不涉及工程工作的事项：
  · 闲聊问候、纯问答、概念解释
  · 简短的确认/反馈："好" "继续" "OK" "yes"
  · 工具查询："npm install 怎么用" "git 怎么回滚"
  · 对已经完成的输出的讨论（不是重新设计）

## 判断原则

1. **最终产物决定类别**：最终要产出一段代码 → coding；最终要产出一个方案/理解 → planning
2. **"分析"≠coding**："帮我分析这段代码的性能" → planning（分析输出的是理解）
3. **"优化"要看有没有代码**："帮我想想怎么优化" → planning；"帮我优化这个函数" → coding
4. **短消息看上下文**：如果只是"好""继续""yes"，归类为 chat
5. **模糊时倾向于 planning**：不确定时默认 planning，因为深度思考不会浪费

## 示例

"你好" → chat
"帮我实现一个 REST API" → coding
"这个架构有什么问题" → planning
"审查一下 src/auth/" → planning
"修复这个空指针异常" → coding
"数据库表怎么设计" → planning
"生成建表 SQL" → coding
"为什么选 Redis 而不是 Memcached" → planning
"写个 README" → planning
"npm install 报错 EACCES 怎么办" → chat
"继续" → chat
"这里用 interface 还是 type" → planning
"帮我改一下" → coding

只输出 planning、coding 或 chat，不要任何解释或标点。`;

// ─── 路由配置 ──────────────────────────────────
// 你可以无限扩展这个配置表。
// 每个条目 = 一个任务类型 → 对应的模型/API
// 支持任意数量的 Provider，每个 Provider 可以用不同的 baseUrl
//
// 示例扩展（取消注释即可启用）：
//
//   review: {
//     name: 'Claude Sonnet',
//     model: 'claude-sonnet-4-20250514',
//     baseUrl: 'https://api.anthropic.com/v1',
//     description: '代码审查 — Claude 审查质量高',
//     keywords: ['审查', 'review', '代码质量'],
//   },
//   research: {
//     name: 'DeepSeek R1',
//     model: 'deepseek-reasoner',
//     baseUrl: 'https://api.deepseek.com/beta',
//     description: '深度研究 — R1 擅长复杂推理',
//     keywords: ['研究', '论文', '数学', '推理', 'research'],
//   },
//
// 注意：Anthropic 协议直接转发；OpenAI 协议代理自动转换格式
const ROUTE_CONFIG = {
  chat: {
    name: 'DeepSeek Flash',
    model: 'deepseek-v4-flash',
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/anthropic/v1',
    description: '日常对话 — DeepSeek 快速且便宜',
    keywords: ['你好', '你是谁', '随便聊聊', '简单', '日常'],
  },
  planning: {
    name: 'DeepSeek Pro',
    model: 'deepseek-v4-pro',
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/anthropic/v1',
    description: '分析/设计/架构/规划 — DeepSeek 推理强',
    keywords: [
      '设计', '架构', '规划', '分析', '方案', '评审', '评估',
      '解释', '理解', '梳理', '文档', '规范', '接口', '选择',
      'design', 'architect', 'plan', 'analyze', 'review', 'evaluate',
      'explain', 'document', 'spec', 'interface', 'compare', 'decide',
      'think', 'consider', 'strategy', 'approach', 'pattern',
    ],
  },
  coding: {
    name: 'DeepSeek Pro',
    model: 'deepseek-v4-pro',
    baseUrl: process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/anthropic/v1',
    description: '编码/实现/重构/调试 — DeepSeek Pro',
    keywords: [
      '实现', '代码', '编写', '函数', '类', '接口', '模块',
      '修改', '重构', '调试', '修复', '开发', '构建', '生成',
      'implement', 'code', 'function', 'class', 'api', 'module',
      'fix', 'debug', 'refactor', 'build', 'develop', 'generate',
      'create', 'write', 'change', 'update', 'patch', 'add', 'remove',
    ],
  },
};

module.exports = { CLASSIFIER_PROMPT, ROUTE_CONFIG };
