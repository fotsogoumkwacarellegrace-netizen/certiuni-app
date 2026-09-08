const fs = require('fs');
const path = require('path');
const root = process.argv[2];
const terms = ['Organization', 'ServiceCatalog', 'verificationRequest', 'Tariff', 'RoleEnum', 'institutionId'];
function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  let out = [];
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out = out.concat(walk(full));
    else if (/\.prisma$/i.test(e.name)) out.push(full);
  }
  return out;
}
const files = walk(root);
console.log('schema files found:', files.length);
for (const f of files) {
  const c = fs.readFileSync(f, 'utf8');
  const hits = terms.filter(t => c.includes(t));
  if (hits.length) console.log(path.basename(f), '=>', hits.join(', '), '  [', c.length, 'bytes ]');
}
