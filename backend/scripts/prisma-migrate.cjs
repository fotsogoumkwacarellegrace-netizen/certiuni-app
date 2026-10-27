const { spawnSync } = require('node:child_process');

const env = { ...process.env };
if (env.DIRECT_URL) {
    env.DATABASE_URL = env.DIRECT_URL;
}

const result = spawnSync(process.execPath, [require.resolve('prisma'), 'migrate', 'deploy'], {
    env,
    stdio: 'inherit',
});

if (result.error) {
    console.error(`Unable to run Prisma migrations: ${result.error.message}`);
    process.exit(1);
}

process.exit(result.status ?? 1);
