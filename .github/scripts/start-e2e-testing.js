const { spawn } = require('child_process');

const RocketChat = spawn('meteor', ['run'], {
    env: {
        ...process.env,
        ADMIN_USERNAME: 'rocketchat.internal.admin.test',
        ADMIN_PASS: 'rocketchat.internal.admin.test',
        ADMIN_EMAIL: 'rocketchat.internal.admin.test@rocket.chat',
        OVERWRITE_SETTING_API_Enable_Rate_Limiter_Dev: '0',
    },
    cwd: './Rocket.Chat'
});

RocketChat.stdout.on('data', data => {
    const line = data.toString();

    if (line.toLowerCase().includes('server running')) {
        JobsManager.onRocketChatStarted();
    }
    console.log(data.toString());
});

RocketChat.stderr.on('data', data => {
    console.error('stderr', data.toString());
});

const JobsManager = new class {
    onRocketChatStarted() {
        console.log('[INFO] RocketChat Started');

        // Apps-Engine E2E Testing
        const E2E = spawn('npm', ['run', 'testapps'], {
            env: { ...process.env },
            cwd: './Rocket.Chat'
        });

        E2E.stdout.on('data', data => {
            console.log('[E2E LOG]', data.toString());
        });

        E2E.stderr.on('data', data => {
            console.log('[E2E ERROR]', data.toString());
            RocketChat.kill();
            E2E.kill();
            process.exit(1);
        });

        E2E.on('exit', code => {
            if (code === 0) {
                RocketChat.kill();
                console.log('All E2E tests passed 🎉');
                return process.exit(0);
            }
            console.error('E2E testing failed to continue 💣 ', code);
            return process.exit(code);
        });
    }
};

process.on('exit', () => {
    RocketChat.kill();
});
