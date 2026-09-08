const fs = require('fs');
const lines = fs.readFileSync('errors.txt', 'utf8').split('\n').map((l) => l.replace(/\r$/, ''));
const targets = ['certificates.service', 'documents.service', 'batch.service', 'batch.controller', 'verification.service', 'students.service', 'universities.service', 'programs.service', 'payments.service', 'organization.service', 'logger.util', 'lib/jwt', 'update-enrollment-status', 'integrations.module', 'uploads.service', 'requests.controller'];
const out = lines.filter((l) => targets.some((t) => l.includes(t)));
fs.writeFileSync('target_errors.txt', out.join('\n'));
console.log('count:', out.length);
