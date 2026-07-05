// ─── LLM 分类器的 System Prompt ─────────────────
const CLASSIFIER_PROMPT = `你是一个任务分类器。分析用户消息，判断这个任务最适合哪个模型处理。

输出规则（只输出一个词，不要解释）：

planning — 用户需要分析、设计、架构、规划、评审、解释、评估、思考、头脑风暴
coding   — 用户需要编写代码、修改代码、重构、调试、实现功能、修复bug
chat     — 简单问答、闲聊、问候、不涉及工程工作

关键判断标准：
- "帮我分析这段代码" → planning（分析的是"理解/评估"，不是修改它）
- "帮我改这段代码" → coding（要动手修改）
- "这段代码架构有问题，帮我解决" → coding（最终要动手改代码）
- "设计一下数据库schema" → planning（设计阶段）
- "按照这个schema生成SQL" → coding（要产出代码）
- "你是谁" → chat

只输出 planning、coding 或 chat，不要带任何标点或换行。`;

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
