import { createApp } from 'vue';
import { ShellClient } from '@invertedapps/sdk/vue';
import App from './App.vue';
import '@invertedapps/design/styles';

// Initialize Shell SDK client
const shellClient = new ShellClient();

// Wait for auth handshake with the host shell
shellClient.ready.then(() => {
    const app = createApp(App);
    app.provide('shellClient', shellClient);
    app.provide('user', shellClient.user);
    app.provide('token', shellClient.token);
    app.mount('#app');
});
