export function registerLifecycleHooks() {
    globalThis.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
        console.error('Unhandled promise rejection:', event.reason);
    });

    globalThis.addEventListener('load', () => {
        console.error('load event fired');
    });

    globalThis.addEventListener('beforeunload', (_e) => {
        console.error('beforeunload event fired', Date.now());
    });

    globalThis.addEventListener('unload', () => {
        console.error('unload event fired');
    });

    globalThis.addEventListener('error', () => {
        console.error('error event fired');
    });
}

export function registerOSSignalHandlers() {
    Deno.addSignalListener('SIGINT', () => {
        console.error('SIGINT received');
    });

    Deno.addSignalListener('SIGTERM', () => {
        console.error('SIGTERM received');
    });

    Deno.addSignalListener('SIGQUIT', () => {
        console.error('SIGQUIT received');
    });

    Deno.addSignalListener('SIGHUP', () => {
        console.error('SIGHUP received');
    });

    Deno.addSignalListener('SIGABRT', () => {
        console.error('SIGABRT received');
    });

    // Deno.addSignalListener('SIGKILL', () => {
    //     console.error('SIGKILL received');
    // });

    // Deno.addSignalListener('SIGSTOP', () => {
    //     console.error('SIGSTOP received');
    // });

    Deno.addSignalListener('SIGTSTP', () => {
        console.error('SIGTSTP received');
    });

    Deno.addSignalListener('SIGCONT', () => {
        console.error('SIGCONT received');
    });

    Deno.addSignalListener('SIGPIPE', () => {
        console.error('SIGPIPE received');
    });

    Deno.addSignalListener('SIGCHLD', () => {
        console.error('SIGCHLD received');
    });

    Deno.addSignalListener('SIGTTIN', () => {
        console.error('SIGTTIN received');
    });

    Deno.addSignalListener('SIGTTOU', () => {
        console.error('SIGTTOU received');
    });

    Deno.addSignalListener('SIGUSR1', () => {
        console.error('SIGUSR1 received');
    });

    Deno.addSignalListener('SIGUSR2', () => {
        console.error('SIGUSR2 received');
    });

    Deno.addSignalListener('SIGWINCH', () => {
        console.error('SIGWINCH received');
    });
}
