#!/usr/bin/env node
/**
 * Trinity Router — Anthropic-compatible LLM智能路由代理
 *
 * Claude Code 发送 Anthropic Messages API 格式 → 代理分类路由 →
 * 转发给 DeepSeek（Anthropic-compatible）或 GLM（OpenAI-compatible）。
 *
 * 用法: node server.js
 * 配置: 复制 .env.example 为 .env，填入 API Key
 * Claude Code 配置: ANTHROPIC_BASE_URL = http://localhost:8888/v1
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const { ROUTE_CONFIG, CLASSIFIER_PROMPT } = require('./routes');

// ─── 加载 .env ──────────────────────────────────
function loadEnv() {
  const envPath = path.join(__dirname, '.env');
  if (!fs.existsSync(envPath)) {
    console.log('  💡 提示: 创建 .env 文件来配置 API Key（参考 .env.example）');
    return;
  }
  const content = fs.readFileSync(envPath, 'utf8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.substring(0, eqIdx).trim();
    let value = trimmed.substring(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
  console.log('  ✅ 已加载 .env 配置');
}
loadEnv();

const PORT = process.env.PORT || 8888;
const DEEPSEEK_KEY = process.env.DEEPSEEK_API_KEY;
const DEEPSEEK_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com/anthropic/v1';
const GLM_KEY = process.env.GLM_API_KEY;
const GLM_URL = process.env.GLM_BASE_URL || 'https://open.bigmodel.cn/api/paas/v4';

// ─── 通用 HTTP 请求 ────────────────────────────
function httpRequest(url, method, headers, body) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const client = u.protocol === 'https:' ? https : http;
    const req = client.request(url, { method, headers }, (res) => {
      const chunks = [];
      res.on('data', (c) => chunks.push(c));
      res.on('end', () => {
        const raw = Buffer.concat(chunks).toString();
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(raw) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, body: raw });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

// ─── Anthropic → OpenAI 格式转换 ─────────────────
function anthropicToOpenAI(messages, system) {
  const openaiMsgs = [];
  if (system) {
    // Anthropic system 是顶层字段，OpenAI 是消息角色
    if (typeof system === 'string') {
      openaiMsgs.push({ role: 'system', content: system });
    } else if (Array.isArray(system)) {
      const text = system.map(b => b.text || '').join('\n');
      openaiMsgs.push({ role: 'system', content: text });
    }
  }
  for (const m of messages) {
    const role = m.role === 'assistant' ? 'assistant' : 'user';
    let content = '';
    if (typeof m.content === 'string') {
      content = m.content;
    } else if (Array.isArray(m.content)) {
      content = m.content.map(b => b.text || '').join('\n');
    }
    openaiMsgs.push({ role, content });
  }
  return openaiMsgs;
}

function openAIToAnthropic(openaiBody, originalModel) {
  const choice = openaiBody.choices?.[0];
  const message = choice?.message || {};
  return {
    id: openaiBody.id || 'msg_' + Date.now(),
    type: 'message',
    role: 'assistant',
    content: [{ type: 'text', text: message.content || '' }],
    model: originalModel,
    stop_reason: choice?.finish_reason || 'end_turn',
    stop_sequence: null,
    usage: {
      input_tokens: openaiBody.usage?.prompt_tokens || 0,
      output_tokens: openaiBody.usage?.completion_tokens || 0,
    },
  };
}

// ─── LLM 分类器（用 Anthropic 格式调用 DeepSeek）─────
async function classifyWithLLM(userMessage) {
  if (!DEEPSEEK_KEY) return keywordFallback(userMessage);

  try {
    const body = JSON.stringify({
      model: 'deepseek-chat',
      messages: [
        { role: 'user', content: CLASSIFIER_PROMPT + '\n\n用户消息: ' + userMessage },
      ],
      max_tokens: 5,
      temperature: 0,
    });

    const result = await httpRequest(
      DEEPSEEK_URL + '/messages',
      'POST',
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${DEEPSEEK_KEY}`,
      },
      body
    );

    if (result.status !== 200) {
      console.log(`  ⚠️ 分类器失败 (${result.status})，退化为关键词匹配`);
      return keywordFallback(userMessage);
    }

    const text = result.body?.content?.[0]?.text?.trim().toLowerCase() || '';
    console.log(`  🏷️  LLM分类: "${text}" → 实际模型: ${ROUTE_CONFIG[text]?.model || 'unknown'}`);

    if (['planning', 'coding', 'chat'].includes(text)) return text;
    return 'planning';
  } catch (err) {
    console.log(`  ⚠️ 分类器异常: ${err.message}，退化为关键词匹配`);
    return keywordFallback(userMessage);
  }
}

// ─── 第1级：简单输入检测（0 tokens）────────────
// 极短消息、常见回复 → 直接 chat
function quickFilter(message) {
  if (typeof message !== 'string') return null;
  const trimmed = message.trim();
  // 空消息或超短（≤5个字符）
  if (!trimmed || trimmed.length <= 5) return 'chat';
  // 常见的简单确认词
  const simpleChat = ['好的', '嗯', 'ok', 'okay', '好', '行', '可以', '对',
    'yes', '是的', '继续', '再来', '然后', 'sure', 'go', 'done', '完了',
    '收到', '明白', '了解', '知道了', 'nice', '不错', '挺好', '可以了'];
  if (simpleChat.includes(trimmed.toLowerCase())) return 'chat';
  return null;
}

// ─── 第2级：关键词强匹配（0 tokens）────────────
// 命中某个路由的关键词且差距明显 → 直接决策
function keywordFastMatch(message) {
  const msg = message.toLowerCase();
  const coding = ROUTE_CONFIG.coding.keywords.filter(k => msg.includes(k.toLowerCase())).length;
  const planning = ROUTE_CONFIG.planning.keywords.filter(k => msg.includes(k.toLowerCase())).length;
  const chat = ROUTE_CONFIG.chat.keywords.filter(k => msg.includes(k.toLowerCase())).length;

  // 必须有明显差距（≥3分差）才跳过 LLM，否则进入第3级
  const max = Math.max(coding, planning, chat);
  if (max === chat && chat >= 2) return 'chat';
  if (max === coding && coding >= 3) return 'coding';
  if (max === planning && planning >= 3) return 'planning';
  return null;  // 差距不够 → 进入第3级 LLM 分类
}

function keywordFallback(message) {
  const msg = message.toLowerCase();
  const coding = ROUTE_CONFIG.coding.keywords.filter(k => msg.includes(k.toLowerCase())).length;
  const planning = ROUTE_CONFIG.planning.keywords.filter(k => msg.includes(k.toLowerCase())).length;
  if (coding > planning) return 'coding';
  if (planning > coding) return 'planning';
  return 'planning';
}

// ─── 路由到后端 ─────────────────────────────────
async function routeToBackend(label, userMessage, anthropicBody) {
  const target = ROUTE_CONFIG[label] || ROUTE_CONFIG.planning;

  if (target.name === 'GLM-4') {
    // GLM 用 OpenAI 格式 → 需要转换
    const openaiMsgs = anthropicToOpenAI(
      anthropicBody.messages || [],
      anthropicBody.system
    );
    // 把用户消息放最后（分类时可能改了）
    const body = JSON.stringify({
      model: target.model,
      messages: openaiMsgs,
      max_tokens: anthropicBody.max_tokens || 4096,
      temperature: anthropicBody.temperature,
      stream: false, // 先不处理流式
    });

    const result = await httpRequest(
      target.baseUrl + '/chat/completions',
      'POST',
      {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GLM_KEY}`,
      },
      body
    );

    if (result.status !== 200) {
      return { status: result.status, body: result.body };
    }

    // OpenAI 响应 → Anthropic 格式
    return { status: 200, body: openAIToAnthropic(result.body, anthropicBody.model) };
  }

  // DeepSeek 直接转发 Anthropic 格式
  // 用路由分类决定的模型名，忽略 Claude Code 传来的原始模型名
  const actualModel = target.model;

  const body = JSON.stringify({
    ...anthropicBody,
    model: actualModel,
    // Anthropic 要求 max_tokens 必须在顶层
    max_tokens: anthropicBody.max_tokens || 4096,
  });

  return httpRequest(
    target.baseUrl + '/messages',
    'POST',
    {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${DEEPSEEK_KEY}`,
    },
    body
  );
}

// ─── URL 解析辅助 ─────────────────────────────
function getPathname(url) {
  const idx = url.indexOf('?');
  return idx === -1 ? url : url.substring(0, idx);
}

// ─── HTTP 服务器 ────────────────────────────────
const server = http.createServer(async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Allow-Methods', '*');
  if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

  const pathname = getPathname(req.url);

  // HEAD 请求一律返回 200（Claude Code 探测连通性）
  if (req.method === 'HEAD') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Anthropic Messages API → POST /v1/messages
  if (req.method === 'POST' && pathname === '/v1/messages') {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', async () => {
      try {
        const body = JSON.parse(Buffer.concat(chunks).toString());
        const messages = body.messages || [];
        const userMsgs = messages.filter(m => m.role === 'user');
        const lastMsg = userMsgs.length > 0 ? userMsgs[userMsgs.length - 1].content : '';
        const preview = (typeof lastMsg === 'string' ? lastMsg : JSON.stringify(lastMsg)).substring(0, 80);

        const label = await classifyWithLLM(
          typeof lastMsg === 'string' ? lastMsg : JSON.stringify(lastMsg)
        );

        console.log(`🚀 [${label.toUpperCase()}] ${body.model || '?'} → ${ROUTE_CONFIG[label]?.name || 'DeepSeek'} (${ROUTE_CONFIG[label]?.model}) | "${preview}..."`);

        const result = await routeToBackend(label, lastMsg, body);

        console.log(`  📤 后端返回 HTTP ${result.status}, model=${result.body?.model || 'N/A'}`);

        // 把响应里的模型名改回 Claude Code 期望的名字
        const originalModel = body.model || 'deepseek-v4-pro';
        if (result.body && typeof result.body === 'object') {
          result.body.model = originalModel;
        }

        console.log(`  ✅ 模型名已修正: → ${originalModel}`);

        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(typeof result.body === 'string' ? result.body : JSON.stringify(result.body));
      } catch (err) {
        console.error('  💥 代理错误:', err.message);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          type: 'error',
          error: { type: 'proxy_error', message: err.message },
        }));
      }
    });
    return;
  }

  // GET /v1/models — Anthropic 模型列表端点
  if (req.method === 'GET' && pathname === '/v1/models') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      data: [
        { id: 'deepseek-v4-pro', display_name: 'DeepSeek V4 Pro (Router)', created_at: '2024-01-01' },
        { id: 'deepseek-v4-flash', display_name: 'DeepSeek V4 Flash (Router)', created_at: '2024-01-01' },
        { id: 'deepseek-chat', display_name: 'DeepSeek Chat (Router)', created_at: '2024-01-01' },
        { id: 'deepseek-reasoner', display_name: 'DeepSeek R1 (Router)', created_at: '2024-01-01' },
        { id: 'glm-4-plus', display_name: 'GLM-4 Plus (Router)', created_at: '2024-01-01' },
        { id: 'claude-sonnet-4-20250514', display_name: 'Claude Sonnet 4 (Router)', created_at: '2024-01-01' },
      ],
    }));
    return;
  }

  // 调试：记录未匹配的请求
  console.log(`  📡 ${req.method} ${req.url}`);

  // 健康检查
  if (pathname === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', uptime: process.uptime() }));
    return;
  }

  // 路由配置
  if (pathname === '/routes') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(ROUTE_CONFIG, null, 2));
    return;
  }

  res.writeHead(404);
  res.end('Not Found');
});

server.listen(PORT, () => {
  console.log(`
╔══════════════════════════════════════════════╗
║     🧠 Trinity Router — Anthropic协议       ║
╠══════════════════════════════════════════════╣
║  端口: ${PORT}                                ║
║  协议: Anthropic Messages API                ║
║  端点: http://localhost:${PORT}/v1/messages    ║
║  健康: http://localhost:${PORT}/health        ║
╠══════════════════════════════════════════════╣
║  planning → DeepSeek (Anthropic直通)         ║
║  coding   → GLM-4   (OpenAI转换)            ║
║  chat     → DeepSeek (默认)                  ║
╚══════════════════════════════════════════════╝

✅ 代理已启动。
   Claude Code 环境变量: ANTHROPIC_BASE_URL=http://localhost:${PORT}/v1
`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ 端口 ${PORT} 已被占用`);
    process.exit(1);
  }
  throw err;
});
