const fs = require('fs');
const l = 'src/app.ts(14,25): error TS2307: Cannot find module x.\r';
const re = /^(.+?)\((\d+),(\d+)\): (error TS\d+): (.*)$/;
console.log('match test:', JSON.stringify(l.match(re)));
const lines = fs.readFileSync('errors.txt', 'utf8').split('\n').filter((x) => x.includes('error TS'));
console.log('lines:', lines.length);
const m2 = lines[0].match(re);
console.log('real first line match:', JSON.stringify(m2));
