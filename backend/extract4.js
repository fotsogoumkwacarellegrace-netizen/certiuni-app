const fs = require('fs');
const s = fs.readFileSync('prisma/schema.prisma', 'utf8');
const lines = s.split('\n');
function extract(header) {
  const start = lines.findIndex((l) => l.startsWith(header));
  if (start === -1) return null;
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].trim() === '}') break;
    const t = lines[i].trim();
    if (t && !t.startsWith('//')) out.push(t);
  }
  return out.join('\n');
}
function extractEnum(name) {
  const start = lines.findIndex((l) => l.startsWith('enum ' + name));
  if (start === -1) return null;
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (lines[i].trim() === '}') break;
    const t = lines[i].trim();
    if (t && !t.startsWith('//')) out.push(t);
  }
  return 'enum ' + name + ' { ' + out.join(', ') + ' }';
}
const out = [];
for (const name of ['Certificate', 'User']) {
  const r = extract('model ' + name + ' ');
  out.push('=== model ' + name + ' ===\n' + (r || 'NOT FOUND'));
}
for (const name of ['PaymentMethod', 'PaymentStatus', 'RequestStatus', 'UserRole', 'CertificateStatus', 'EnrollmentStatus']) {
  const r = extractEnum(name);
  if (r) out.push(r);
}
fs.writeFileSync('schema_info3.txt', out.join('\n\n'));
console.log('done');
