import { build } from 'esbuild';

import { IParseAppPackageResult } from '../../compiler';

export async function bundleLegacyApp(appPackage: IParseAppPackageResult) {
    const buildResult = await build({
        write: false,
        bundle: true,
        minify: true,
        platform: 'node',
        target: ['node10'],
        define: {
            'global.Promise': 'Promise',
        },
        external: ['@rocket.chat/apps-engine/*'],
        stdin: {
            contents: appPackage.files[appPackage.info.classFile],
            sourcefile: appPackage.info.classFile,
            loader: 'js',
        },
    });
}
