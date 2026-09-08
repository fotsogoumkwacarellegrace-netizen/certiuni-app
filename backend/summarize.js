const fs = require('fs');
const lines = fs.readFileSync('errors.txt', 'utf8').split('\n').map((l) => l.replace(/\r$/, '')).filter((l) => l.includes('error TS'));
const re = /^(.+?)\((\d+),(\d+)\): (error TS\d+): (.*)$/;
const byFile = {};
for (const l of lines) {
  const m = l.match(re);
  if (!m) continue;
  (byFile[m[1]] = byFile[m[1]] || []).push(m[4] + ' ' + m[5].slice(0, 110));
}
let out = [];
for (const [f, errs] of Object.entries(byFile)) {
  out.push('=== ' + f + ' (' + errs.length + ') ===');
  errs.slice(0, 10).forEach((e) => out.push('  ' + e));
  if (errs.length > 10) out.push('  ...+' + (errs.length - 10) + ' more');
}
out.unshift('TOTAL: ' + lines.length + ' | FILES: ' + Object.keys(byFile).length);
fs.writeFileSync('error_summary.txt', out.join('\n'));
console.log(out.join('\n'));
