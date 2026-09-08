const fs = require('fs');
const path = require('path');

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(p);
    } else if (entry.name.endsWith('.ts')) {
      const dirRel = path.relative('src', path.dirname(p)).split(path.sep);
      const prefix = '../'.repeat(dirRel.length) + 'common/';
      let content = fs.readFileSync(p, 'utf8');
      const re = /(['"])(?:(?:\.\.\/)*common\/)+(?:decorators|guards)\/[^'"]+\1/g;
      const original = content;
      content = content.replace(re, (match, quote) => {
        const spec = match.slice(1, -1);
        const idx = spec.lastIndexOf('common/') + 'common/'.length;
        return quote + prefix + spec.slice(idx) + quote;
      });
      if (content !== original) {
        fs.writeFileSync(p, content);
        console.log('fixed ' + path.relative('src', p));
      }
    }
  }
}

walk('src/modules');
console.log('DONE');