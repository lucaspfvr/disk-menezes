import { app, html, loginPage, themeCss } from './assets.generated.mjs';
import { loadWorkspace, storeWorkspace } from './workspace.mjs';

const sessionSeconds = 30 * 24 * 60 * 60;
const cookieName = '__Host-disk_session';
const headers = {
  'Cache-Control': 'private, no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'same-origin',
  'Content-Security-Policy': "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; frame-ancestors 'none'; form-action 'self'"
};

const asset = (body, type, status = 200) => new Response(body, {
  status, headers: { ...headers, 'Content-Type': type }
});
const json = (value, status = 200) => Response.json(value, { status, headers });
const redirect = (location, cookie) => new Response(null, {
  status: 303, headers: { ...headers, Location: location, ...(cookie ? { 'Set-Cookie': cookie } : {}) }
});
const cookie = (token, seconds) => `${cookieName}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${seconds}`;
const hex = bytes => Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
const digest = async value => hex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value)));
const form = (message = '', status = 200) => asset(
  loginPage.replace('<!-- mensagem -->', message && `<p role="alert" class="error">${message}</p>`),
  'text/html; charset=utf-8', status
);

function loginUnavailable(code) {
  console.error('Disk Menezes login:', code);
  return form('Login temporariamente indisponível. Código: ' + code + '.', 503);
}

function supabaseEndpoint(value) {
  try {
    const url = new URL(value.trim());
    if (url.protocol !== 'https:' || url.username || url.password || url.pathname !== '/' || url.search || url.hash) return null;
    return new URL('/auth/v1/token?grant_type=password', url).href;
  } catch {
    return null;
  }
}

// O navegador leva o cookie. No banco eu guardo só o hash da sessão.
async function session(request, db) {
  const raw = request.headers.get('Cookie')?.split(/;\s*/).find(part => part.startsWith(cookieName + '='))?.slice(cookieName.length + 1);
  if (!raw || !/^[a-f0-9]{64}$/.test(raw)) return null;
  return db.prepare('SELECT * FROM disk_sessions WHERE token_hash=? AND expires>?').bind(await digest(raw), Date.now()).first();
}

async function readAuthForm(request) {
  if (Number(request.headers.get('Content-Length')) > 4096 ||
      request.headers.get('Content-Type')?.split(';')[0] !== 'application/x-www-form-urlencoded') return null;
  const reader = request.body?.getReader();
  if (!reader) return null;
  const decoder = new TextDecoder();
  let input = '', total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > 4096) { await reader.cancel(); return null; }
    input += decoder.decode(value, { stream: true });
  }
  return new URLSearchParams(input + decoder.decode());
}

// O Supabase verifica a senha. A lista do projeto decide quem pode entrar.
async function login(request, env, allowlist, active) {
  const fields = await readAuthForm(request);
  if (!fields) return form('Dados de login inválidos.', 400);
  const email = (fields.get('email') ?? '').trim().toLowerCase();
  const password = fields.get('senha') ?? '';
  if (!email || email.length > 254 || !password || new TextEncoder().encode(password).length > 256) {
    return form('E-mail ou senha incorretos.', 401);
  }
  const endpoint = supabaseEndpoint(env.SUPABASE_URL);
  if (!endpoint) return loginUnavailable('LOGIN-URL');
  const key = env.SUPABASE_KEY.trim();
  if (!/^(sb_publishable_|eyJ)[A-Za-z0-9_.-]+$/.test(key)) return loginUnavailable('LOGIN-CHAVE');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  let upstream;
  try {
    upstream = await fetch(endpoint, {
      method: 'POST', headers: { apikey: key, 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }), redirect: 'manual', signal: controller.signal
    });
  } catch {
    return loginUnavailable(controller.signal.aborted ? 'LOGIN-TEMPO' : 'LOGIN-REDE');
  } finally {
    clearTimeout(timeout);
  }
  if (upstream.status >= 300 && upstream.status < 400) return loginUnavailable('LOGIN-REDIRECIONAMENTO');
  if (upstream.status === 429) return form('Muitas tentativas. Aguarde e tente novamente.', 429);
  if (upstream.status === 401 || upstream.status === 403) return loginUnavailable('LOGIN-API-' + upstream.status);
  if (upstream.status >= 500 || upstream.status === 404) return loginUnavailable('LOGIN-API-' + upstream.status);
  if (!upstream.ok) return form('E-mail ou senha incorretos.', 401);
  let user;
  try {
    ({ user } = await upstream.json());
  } catch {
    return loginUnavailable('LOGIN-RESPOSTA');
  }
  if (!user?.id || !allowlist.has(user.email?.toLowerCase()) || user.email.toLowerCase() !== email) {
    return form('E-mail ou senha incorretos.', 401);
  }
  const token = hex(crypto.getRandomValues(new Uint8Array(32)).buffer);
  const now = Date.now();
  const db = env.DB;
  const writes = [
    db.prepare('DELETE FROM disk_sessions WHERE expires<=?').bind(now),
    db.prepare('INSERT INTO disk_sessions VALUES (?,?,?,?)').bind(await digest(token), user.id, email, now + sessionSeconds * 1000)
  ];
  if (active) writes.push(db.prepare('DELETE FROM disk_sessions WHERE token_hash=?').bind(active.token_hash));
  try {
    await db.batch(writes);
  } catch {
    return loginUnavailable('LOGIN-SESSAO');
  }
  return redirect('/', cookie(token, sessionSeconds));
}

function recoveryForm(step, message = '', status = 200) {
  const title = step === 'send' ? 'Recuperar senha' : 'Definir nova senha';
  const path = step === 'send' ? '/recuperar' : '/redefinir';
  const fields = step === 'send'
    ? '<p>Informe o e-mail cadastrado para receber um código de recuperação.</p>'
    : '<label>Código do e-mail<input name="codigo" autocomplete="one-time-code" inputmode="numeric" pattern="[0-9]{6,10}" maxlength="10" required></label>'+
      '<label>Nova senha<input type="password" name="senha" autocomplete="new-password" minlength="8" maxlength="128" required></label>'+
      '<label>Confirme a nova senha<input type="password" name="confirmacao" autocomplete="new-password" minlength="8" maxlength="128" required></label>';
  const messageHtml = message ? '<p class="'+(status >= 400 ? 'error' : 'notice')+'" role="status">'+message+'</p>' : '';
  const content = '<h1>'+title+'</h1>'+messageHtml+'<form action="'+path+'" method="post">'+
    '<label>E-mail<input type="email" name="email" autocomplete="username" maxlength="254" required></label>'+fields+
    '<button type="submit">'+(step === 'send' ? 'Enviar código' : 'Salvar nova senha')+'</button></form>'+
    (step === 'send' ? '<a class="auth-link" href="/redefinir">Já tenho um código</a>' : '<a class="auth-link" href="/recuperar">Pedir outro código</a>')+
    '<a class="auth-link" href="/entrar">Voltar ao login</a>';
  return asset(loginPage.slice(0, loginPage.indexOf('<h1>'))+content+'</main></body></html>', 'text/html; charset=utf-8', status);
}

async function recoveryRequest(env, path, body, auth = {}) {
  const base = supabaseEndpoint(env.SUPABASE_URL);
  if (!base) throw new Error('Supabase URL');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    return await fetch(new URL(path, base).href, {
      method: auth.method ?? 'POST', redirect: 'manual', signal: controller.signal,
      headers: {
        apikey: env.SUPABASE_KEY.trim(), 'Content-Type': 'application/json',
        ...(auth.token ? { Authorization: 'Bearer ' + auth.token } : {})
      }, body: JSON.stringify(body)
    });
  } finally {
    clearTimeout(timeout);
  }
}

// O código de recuperação é verificado antes de aceitar a nova senha.
async function recover(request, env, allowlist, step) {
  if (request.method === 'GET') return recoveryForm(step);
  const fields = await readAuthForm(request);
  if (!fields) return recoveryForm(step, 'Confira os dados do formulário.', 400);
  const email = (fields.get('email') ?? '').trim().toLowerCase();
  if (!email || email.length > 254) return recoveryForm(step, 'Informe um e-mail válido.', 400);
  const allowed = allowlist.has(email);
  try {
    if (step === 'send') {
      if (allowed) {
        const returnTo = new URL('/redefinir', request.url);
        const query = new URLSearchParams({redirect_to: returnTo.href});
        const response = await recoveryRequest(env, '/auth/v1/recover?'+query, {email});
        if (!response.ok) console.error('Disk Menezes recuperação:', response.status);
      }
      return recoveryForm('verify', 'Se o e-mail estiver cadastrado, você receberá um código. Verifique também a pasta de spam.');
    }
    const token = fields.get('codigo') ?? '';
    const password = fields.get('senha') ?? '';
    const confirmation = fields.get('confirmacao');
    if (!allowed || !/^[0-9]{6,10}$/.test(token)) return recoveryForm(step, 'E-mail ou código inválido. Confira os dados ou solicite outro código.', 400);
    if (password.length < 8 || password !== confirmation || new TextEncoder().encode(password).length > 256) {
      return recoveryForm(step, 'Use pelo menos 8 caracteres e repita a mesma senha.', 400);
    }
    const verification = await recoveryRequest(env, '/auth/v1/verify', {email, token, type:'recovery'});
    if (!verification.ok) return recoveryForm(step, 'E-mail ou código inválido ou expirado. Confira os dados ou solicite outro código.', 400);
    const {access_token: accessToken, user} = await verification.json();
    if (!accessToken || !user?.id || user.email?.toLowerCase() !== email) {
      return recoveryForm(step, 'E-mail ou código inválido. Solicite outro código.', 400);
    }
    const updated = await recoveryRequest(env, '/auth/v1/user', {password}, {method:'PUT', token:accessToken});
    if (!updated.ok) return recoveryForm(step, 'A senha não pôde ser alterada. Solicite outro código e use uma senha mais forte.', 400);
    try {
      await env.DB.prepare('DELETE FROM disk_sessions WHERE user_id=?').bind(user.id).run();
    } catch {
      console.error('Disk Menezes recuperação: falha ao encerrar sessões anteriores.');
    }
    return redirect('/entrar?senha=alterada',cookie('',0));
  } catch {
    if (step === 'send') {
      console.error('Disk Menezes recuperação: falha de conexão ao enviar código.');
      return recoveryForm('verify', 'Se o e-mail estiver cadastrado, você receberá um código. Verifique também a pasta de spam.');
    }
    return recoveryForm(step, 'A recuperação está temporariamente indisponível. Tente novamente em instantes.', 503);
  }
}

// Centralizo aqui as rotas públicas e as que exigem uma sessão válida.
async function route(request, env) {
  const url = new URL(request.url);
  const { pathname } = url;
  const { method } = request;
  if (pathname === '/theme.css' && method === 'GET') return asset(themeCss, 'text/css; charset=utf-8');
  if (!env.DB || !env.SUPABASE_KEY || !env.SUPABASE_URL) return json({ error: 'Configuração pendente.' }, 503);
  const allowlist = new Set((env.DISK_ALLOWED_EMAILS ?? '').split(',').map(email => email.trim().toLowerCase()).filter(Boolean));
  if (!allowlist.size) return json({ error: 'Acesso ainda não configurado.' }, 503);
  if (method !== 'GET' && (request.headers.get('Origin') !== url.origin || request.headers.get('Sec-Fetch-Site') === 'cross-site')) {
    return json({ error: 'Origem inválida.' }, 403);
  }
  if ((method === 'GET' || method === 'POST') && (pathname === '/recuperar' || pathname === '/redefinir')) {
    return recover(request, env, allowlist, pathname === '/recuperar' ? 'send' : 'verify');
  }
  let active;
  try {
    active = await session(request, env.DB);
  } catch (error) {
    if (pathname === '/entrar') return loginUnavailable('LOGIN-LEITURA');
    throw error;
  }
  const allowed = active && allowlist.has(active.email);
  if (pathname === '/entrar' && method === 'GET') {
    if (allowed) return redirect('/');
    return url.searchParams.get('senha') === 'alterada'
      ? asset(loginPage.replace('<!-- mensagem -->','<p class="notice" role="status">Senha alterada. Entre com sua nova senha.</p>'),'text/html; charset=utf-8')
      : form();
  }
  if (pathname === '/entrar' && method === 'POST') return login(request, env, allowlist, active);
  if (pathname === '/sair' && method === 'POST') {
    if (active) await env.DB.prepare('DELETE FROM disk_sessions WHERE token_hash=?').bind(active.token_hash).run();
    return redirect('/entrar', cookie('', 0));
  }
  if (!allowed) return pathname === '/' && method === 'GET' ? redirect('/entrar') : json({ error: 'Entre para continuar.' }, 401);
  if (pathname === '/' && method === 'GET') return asset(html, 'text/html; charset=utf-8');
  if (pathname === '/app.js' && method === 'GET') return asset(app, 'text/javascript; charset=utf-8');
  const match = /^\/api\/state\/(real|demo)$/.exec(pathname);
  if (!match) return json({ error: 'Página não encontrada.' }, 404);
  const space = match[1];
  const owner = space === 'real' ? 'business' : 'demo:' + active.user_id;
  if (method === 'GET') return json(await loadWorkspace(env.DB, owner, space));
  if (method === 'PUT') return storeWorkspace(env.DB, owner, space, request);
  return json({ error: 'Método indisponível.' }, 405);
}

export default {
  async fetch(request, env) {
    try { return await route(request, env); }
    catch (error) {
      console.error('Falha no Disk Menezes:', error.name);
      return new URL(request.url).pathname === '/entrar'
        ? loginUnavailable('LOGIN-INTERNO')
        : json({ error: 'Serviço temporariamente indisponível.' }, 503);
    }
  }
};
