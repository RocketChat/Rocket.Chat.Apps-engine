import type { App } from '@rocket.chat/apps-engine/definition/App.ts';
import { AppStatus } from '@rocket.chat/apps-engine/definition/AppStatus.ts';

import { AppObjectRegistry } from '../../AppObjectRegistry.ts';

export default async function handleSetStatus(params: unknown): Promise<null> {
    if (!Array.isArray(params) || !Object.values(AppStatus).includes(params[0])) {
        throw new Error('Invalid params', { cause: 'invalid_param_type' });
    }

    const [status] = params as [AppStatus];

    const app = AppObjectRegistry.get<App>('app');

    if (!app || typeof app['setStatus'] !== 'function') {
        throw new Error('App must contain a setStatus function', {
            cause: 'invalid_app',
        });
    }

    await app['setStatus'](status);

    return null;
}
