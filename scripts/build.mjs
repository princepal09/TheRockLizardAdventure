import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { fileURLToPath } from 'node:url';
import { parseEnv } from 'node:util';

const root = fileURLToPath(new URL('../', import.meta.url));
const frontend = path.join(root, 'frontend');
const backend = path.join(root, 'backend');
const requireFrontend = createRequire(path.join(frontend, 'package.json'));
const { loadEnvConfig } = requireFrontend('@next/env');
const npmCli = process.env.npm_execpath;
let temporaryApi;
let buildProcess;

function stopChildren() {
  buildProcess?.kill();
  temporaryApi?.kill();
}

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => {
    stopChildren();
    process.exit(signal === 'SIGINT' ? 130 : 143);
  });
}

async function build(directory) {
  if (!npmCli) throw new Error('Run this script using npm run build.');
  const child = spawn(process.execPath, [npmCli, '--prefix', directory, 'run', 'build'], {
    cwd: root,
    stdio: 'inherit',
    windowsHide: true,
  });
  buildProcess = child;
  const [code] = await once(child, 'exit');
  buildProcess = undefined;
  if (code !== 0) throw new Error(`${directory} build failed.`);
}

async function apiIsReady(url) {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
    await response.arrayBuffer();
    return response.ok;
  } catch {
    return false;
  }
}

try {
  await build('backend');

  // Match Next.js's production .env precedence, including .env.local overrides.
  loadEnvConfig(frontend, false);
  const apiBase = process.env.NEXT_PUBLIC_API_BASE_URL;
  if (!apiBase) throw new Error('Set NEXT_PUBLIC_API_BASE_URL in frontend/.env before building.');
  const apiUrl = new URL(apiBase);
  const healthUrl = new URL('/health-check', apiUrl);

  if (!(await apiIsReady(healthUrl))) {
    const isLocal = ['localhost', '127.0.0.1', '[::1]'].includes(apiUrl.hostname);
    let backendEnv = {};
    try {
      backendEnv = parseEnv(readFileSync(path.join(backend, '.env'), 'utf8'));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const backendPort = process.env.PORT ?? backendEnv.PORT;
    if (!isLocal || apiUrl.protocol !== 'http:' || apiUrl.port !== String(backendPort)) {
      throw new Error('The configured API is unavailable. Start/deploy it before building the frontend.');
    }

    console.log('\nStarting the local API temporarily for frontend prerendering...');
    temporaryApi = spawn(process.execPath, ['dist/src/index.js'], {
      cwd: backend,
      stdio: 'inherit',
      windowsHide: true,
    });
    let startupError;
    temporaryApi.on('error', (error) => { startupError = error; });
    let ready = false;
    const deadline = Date.now() + 90_000;
    while (Date.now() < deadline) {
      if (startupError) throw startupError;
      if (temporaryApi.exitCode !== null || temporaryApi.signalCode !== null) {
        throw new Error('The API stopped during startup. Check backend/.env and the error above.');
      }
      if (await apiIsReady(healthUrl)) {
        ready = true;
        break;
      }
      await delay(250);
    }
    if (!ready) throw new Error('API startup timed out. Check backend/.env and the API port.');
  } else {
    console.log('\nUsing the already-running API for frontend prerendering.');
  }

  // Health alone does not check MySQL. Fail clearly before Next.js prerenders pages.
  const contentUrl = `${apiBase.replace(/\/$/, '')}/site-settings`;
  if (!(await apiIsReady(contentUrl))) {
    throw new Error('The API cannot serve site settings. Check MySQL, DATABASE_URL and database migrations.');
  }
  await build('frontend');
} catch (error) {
  console.error(`\nBuild failed: ${error.message}`);
  process.exitCode = 1;
} finally {
  if (temporaryApi) {
    console.log('\nStopping the temporary build API.');
    const exited = once(temporaryApi, 'exit');
    if (temporaryApi.exitCode === null && temporaryApi.signalCode === null) {
      temporaryApi.kill();
      await exited;
    }
  }
}
