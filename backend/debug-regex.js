const fs = require('fs');
const c = fs.readFileSync('src/modules/auth/auth.controller.ts', 'utf8');
const re = /(['"])(?:(?:\.\.\/)+common|common)\/(?:decorators|guards)\/([^'"]+)\1/g;
console.log('matches:', JSON.stringify(c.match(re)));
console.log('content lines with common:');
c.split('\n').filter((l) => l.includes('common/')).forEach((l) => console.log('  ' + l.trim()));