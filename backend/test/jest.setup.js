const { randomBytes } = require('node:crypto');

process.env.JWT_ACCESS_SECRET ??= randomBytes(48).toString('hex');
process.env.JWT_REFRESH_SECRET ??= randomBytes(48).toString('hex');
process.env.STRIPE_SECRET_KEY = `sk_test_${randomBytes(24).toString('hex')}`;
process.env.STRIPE_WEBHOOK_SECRET = `whsec_${randomBytes(24).toString('hex')}`;
process.env.APP_URL = 'http://localhost:4200';
