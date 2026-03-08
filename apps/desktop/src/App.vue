<template>
  <div id="shell-app" v-if="ready">
    <div class="app-container">
      <header class="app-header">
        <h1>{{ appName }}</h1>
        <p v-if="user" class="welcome-text">
          Welcome, <strong>{{ user.name }}</strong>
        </p>
      </header>

      <main class="app-main">
        <div class="card api-card">
          <h2>🔗 API Connection</h2>
          <div v-if="apiLoading" class="api-status loading">
            <span class="spinner"></span> Connecting to API...
          </div>
          <div v-else-if="apiError" class="api-status error">
            ❌ {{ apiError }}
          </div>
          <div v-else class="api-status success">
            <p class="api-message">{{ apiMessage }}</p>
            <p class="api-hint">Your frontend is talking to your backend! 🎉</p>
          </div>
        </div>

        <div class="card">
          <h2>🚀 Desktop app is running</h2>
          <p>
            This is your Inverted app scaffold. Edit
            <code>apps/desktop/src/App.vue</code> to start building.
          </p>
          <ul class="feature-list">
            <li>✅ Shell SDK connected — user context available</li>
            <li>✅ Design system loaded — <code>@invertedapps/design</code></li>
            <li>✅ API ready at <code>/graphql</code></li>
            <li>✅ Prisma ORM configured</li>
          </ul>
        </div>

        <div class="card">
          <h2>📦 Next Steps</h2>
          <ol class="steps-list">
            <li>Add models to <code>prisma/schema.prisma</code></li>
            <li>Run <code>pnpm --filter @app/api db:push</code></li>
            <li>Create GraphQL resolvers in <code>apps/api/src/</code></li>
            <li>Build your UI here with design system components</li>
            <li>Define workers in <code>workers.yaml</code></li>
          </ol>
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

// Check if we're inside a shell by looking for user context
onMounted(() => {
    if (user) {
        ready.value = true;
    }
});

// Also listen for delayed shell init
const shellClient = inject<any>('shellClient', null);
if (shellClient) {
    ready.value = true;
}

const apiMessage = ref('');
const apiLoading = ref(true);
const apiError = ref('');

onMounted(async () => {
    if (!ready.value) return;
    try {
        const apiUrl = import.meta.env.VITE_APP_API_URL || 'http://localhost:8080';
        const res = await fetch(`${apiUrl}/graphql`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: '{ hello }' }),
        });
        const json = await res.json();
        if (json.data?.hello) {
            apiMessage.value = json.data.hello;
        } else {
            apiError.value = 'Unexpected API response';
        }
    } catch (e: any) {
        apiError.value = `Could not reach API: ${e.message}`;
    } finally {
        apiLoading.value = false;
    }
});
</script>

<style>
* { margin: 0; padding: 0; box-sizing: border-box; }

.app-container {
  min-height: 100vh;
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
  color: #e2e8f0;
  padding: 2rem;
}

.app-header { text-align: center; margin-bottom: 3rem; }

.app-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #818cf8, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.welcome-text { font-size: 1.1rem; color: #94a3b8; }

.app-main {
  max-width: 640px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 1.5rem 2rem;
  backdrop-filter: blur(12px);
}

.api-card { border-color: rgba(129, 140, 248, 0.3); }

.card h2 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.75rem; }
.card p { color: #94a3b8; line-height: 1.6; }

.card code {
  background: rgba(129, 140, 248, 0.15);
  color: #a5b4fc;
  padding: 0.15em 0.4em;
  border-radius: 4px;
  font-size: 0.9em;
}

.api-status { padding: 1rem; border-radius: 8px; }
.api-status.loading { background: rgba(129, 140, 248, 0.1); color: #a5b4fc; display: flex; align-items: center; gap: 0.75rem; }
.api-status.error { background: rgba(239, 68, 68, 0.1); color: #fca5a5; }
.api-status.success { background: rgba(34, 197, 94, 0.1); }
.api-message { font-size: 1.1rem; font-weight: 600; color: #86efac !important; margin-bottom: 0.25rem; }
.api-hint { font-size: 0.85rem; color: #6ee7b7 !important; }

.spinner {
  width: 16px; height: 16px;
  border: 2px solid rgba(129, 140, 248, 0.3);
  border-top-color: #818cf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.feature-list, .steps-list { margin-top: 0.75rem; padding-left: 0; list-style: none; }
.feature-list li, .steps-list li { padding: 0.35rem 0; color: #cbd5e1; }
.steps-list { list-style: decimal; padding-left: 1.25rem; }

/* Shell fallback */
.shell-fallback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', system-ui, sans-serif;
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a3e 50%, #0f0f23 100%);
  color: #e2e8f0;
}

.fallback-card {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  backdrop-filter: blur(12px);
  max-width: 400px;
}

.fallback-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.fallback-card h1 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  background: linear-gradient(135deg, #818cf8, #c084fc);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.fallback-card p {
  color: #94a3b8;
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.fallback-link {
  color: #818cf8;
  text-decoration: none;
  font-weight: 500;
}

.fallback-link:hover { text-decoration: underline; }
</style>
