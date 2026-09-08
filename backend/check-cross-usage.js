const fs = require('fs');
const path = require('path');
function walk(d) {
  let r = [];
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name);
    if (e.isDirectory() && !['node_modules', 'dist'].includes(e.name)) r = r.concat(walk(p));
    else if (e.name.endsWith('.ts')) r.push(p);
  }
  return r;
}
const legacyDirs = ['src/services', 'src/jobs', 'src/lib', 'src/utils', 'src/middlewares', 'src/errors', 'src/dtos'].filter((d) => fs.existsSync(d));
const legacy = [].concat(...legacyDirs.map((d) => walk(d)));
const nest = [...walk('src/modules'), ...walk('src/common'), ...walk('src/config')];
const legacyPaths = legacy.map((f) => f.split(path.sep).join('/').replace(/^src\//, '').replace(/\.ts$/, ''));
for (const f of nest) {
  const c = fs.readFileSync(f, 'utf8');
  for (const l of legacyPaths) {
    if (c.includes(l)) console.log(f.split(path.sep).join('/'), '->', l);
  }
}
console.log('DONE. legacy files:', legacy.length);
