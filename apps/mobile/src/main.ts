import { createApp } from 'vue';
import App from './App.vue';
import '@invertedapps/design/styles';

// Try to connect to the Shell SDK if available
let shellClient: any = null;
try {
    const { ShellClient } = await import('@invertedapps/sdk/vue');
    shellClient = new ShellClient();
} catch {
    // SDK not available — standalone mode
}

const app = createApp(App);

if (shellClient) {
    // In shell mode: wait for handshake, then provide context
    shellClient.ready.then(() => {
        app.provide('shellClient', shellClient);
        app.provide('user', shellClient.user);
        app.provide('token', shellClient.token);
        app.mount('#app');
    });

    // Fallback: mount after 2s even if handshake doesn't complete
    setTimeout(() => {
        if (!app._container) {
            app.mount('#app');
        }
    }, 2000);
} else {
    // Standalone mode: mount immediately (will show fallback)
    app.mount('#app');
}
