const fs = require('fs');
const s = fs.readFileSync(process.argv[2], 'utf8');
const names = process.argv.slice(3);
for (const n of names) {
  const re = new RegExp('model ' + n + '\\s*\\{[^]*?\\n\\}', 'g');
  let m;
  while ((m = re.exec(s)) !== null) {
    console.log('==== ' + n + ' ====');
    console.log(m[0]);
    break;
  }
}
console.log('---- enums ----');
const er = s.match(/^enum\s+\w+/gm);
if (er) console.log(er.join('\n'));
