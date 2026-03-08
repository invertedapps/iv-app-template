import { createApp } from 'vue';
import App from './App.vue';
import '@invertedapps/design/styles';

const app = createApp(App);

// Try to connect to the Shell SDK if available
async function initShell() {
    try {
        const { ShellClient } = await import('@invertedapps/sdk/vue');
        const shellClient = new ShellClient();
        await shellClient.ready;
        app.provide('shellClient', shellClient);
        app.provide('user', shellClient.user);
        app.provide('token', shellClient.token);
    } catch {
        // SDK not available or handshake failed — standalone mode
    }
    app.mount('#app');
}

// Start shell init with a timeout
const mounted = { done: false };
initShell().then(() => { mounted.done = true; });
setTimeout(() => {
    if (!mounted.done) app.mount('#app');
}, 2000);
