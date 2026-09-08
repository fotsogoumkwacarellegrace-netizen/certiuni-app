const fs = require('fs');
const s = fs.readFileSync('prisma/schema.prisma', 'utf8');
const out = [];
for (const name of ['Certificate', 'User']) {
  const m = s.match(new RegExp('model ' + name + ' \\\\{([\\\\s\\\\S]*?)\\\\n\\\\}'));
  if (m) { out.push('=== model ' + name + ' ==='); out.push(m[1].split('\\n').filter((l) => l.trim() && !l.trim().startsWith('//')).map((l) => l.trim()).join('\\n')); }
}
const em = s.match(/enum (PaymentMethod|PaymentStatus|RequestStatus) \\\\{[\\\\s\\\\S]*?\\\\n\\\\}/g);
if (em) out.push(em.join('\\n'));
fs.writeFileSync('schema_info3.txt', out.join('\\n\\n'));
console.log('written');
