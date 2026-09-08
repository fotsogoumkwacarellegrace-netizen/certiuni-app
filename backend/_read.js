const fs = require('fs');
const files = process.argv.slice(2);
for (const f of files) {
  console.log('\n========== ' + f + ' ==========');
  try {
    const c = fs.readFileSync(f, 'utf8');
    console.log(c);
  } catch (e) {
    console.log('READ ERROR: ' + e.message);
  }
}
