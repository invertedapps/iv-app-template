<template>
  <div id="shell-app" v-if="ready">
    <div class="app-container">
      <header class="app-header">
        <h1>⚙️ {{ appName }} Admin</h1>
        <p v-if="user" class="welcome-text">
          Welcome, <strong>{{ user.name }}</strong>
        </p>
      </header>

      <main class="app-main">
        <div class="card">
          <h2>⚙️ Admin Panel</h2>
          <p>
            This is the admin panel for your Inverted app.
            Edit <code>apps/admin/src/App.vue</code> to build your admin dashboard.
          </p>
          <ul class="feature-list">
            <li>✅ Full admin access</li>
            <li>✅ Design system loaded</li>
            <li>✅ Shell SDK connected</li>
            <li>✅ Shared API backend</li>
          </ul>
        </div>

        <div class="card">
          <h2>🛠 Admin Features</h2>
          <ul class="feature-list">
            <li>📊 Analytics &amp; metrics</li>
            <li>👥 User management</li>
            <li>🔧 App configuration</li>
            <li>📋 Content management</li>
          </ul>
        </div>
      </main>
    </div>
  </div>

  <div v-else class="shell-fallback">
    <div class="fallback-card">
      <div class="fallback-icon">▽</div>
      <h1>Inverted App</h1>
      <p>This app must be opened within a compatible Inverted shell.</p>
      <a href="https://inverted.run" class="fallback-link">Learn more →</a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, onMounted } from 'vue';

const appName = import.meta.env.VITE_APP_NAME || 'My App';
const user = inject<{ name: string; email: string } | null>('user', null);
const ready = ref(false);

onMounted(() => { if (user) ready.value = true; });
const shellClient = inject<any>('shellClient', null);
if (shellClient) ready.value = true;
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

.app-container {
  min-height: 100vh;
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%);
  color: #e2e8f0;
  padding: 2rem;
}

.app-header { text-align: center; margin-bottom: 3rem; }
.app-header h1 {
  font-size: 2rem; font-weight: 700;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
  background-clip: text; margin-bottom: 0.5rem;
}
.welcome-text { font-size: 1.1rem; color: #94a3b8; }

.app-main {
  max-width: 640px; margin: 0 auto;
  display: flex; flex-direction: column; gap: 1.5rem;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px; padding: 1.5rem 2rem;
  backdrop-filter: blur(12px);
}
.card h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; }
.card p { color: #94a3b8; line-height: 1.6; }
.card code {
  background: rgba(245, 158, 11, 0.15); color: #fbbf24;
  padding: 0.15em 0.4em; border-radius: 4px; font-size: 0.9em;
}

.feature-list { margin-top: 0.75rem; padding-left: 0; list-style: none; }
.feature-list li { padding: 0.35rem 0; color: #cbd5e1; }

.shell-fallback {
  min-height: 100vh; display: flex; align-items: center; justify-content: center;
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(135deg, #0d1117 0%, #161b22 50%, #0d1117 100%);
  color: #e2e8f0;
}
.fallback-card {
  text-align: center; padding: 3rem;
  background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px; backdrop-filter: blur(12px); max-width: 400px;
}
.fallback-icon { font-size: 3rem; margin-bottom: 1rem; opacity: 0.6; }
.fallback-card h1 {
  font-size: 1.5rem; font-weight: 600; margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #f59e0b, #ef4444);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.fallback-card p { color: #94a3b8; margin-bottom: 1.5rem; line-height: 1.6; }
.fallback-link { color: #f59e0b; text-decoration: none; font-weight: 500; }
.fallback-link:hover { text-decoration: underline; }
</style>
