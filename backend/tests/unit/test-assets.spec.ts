import * as fs from 'fs';
import * as path from 'path';
import * as XLSX from 'xlsx';

const assetsDirectory = path.resolve(__dirname, '../assets');

function readCsvRows(relativePath: string): Record<string, string>[] {
  const filePath = path.join(assetsDirectory, relativePath);
  const workbook = XLSX.read(fs.readFileSync(filePath), { type: 'buffer' });
  const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
  return XLSX.utils.sheet_to_json(firstSheet, { defval: '' });
}

describe('backend test assets', () => {
  it('provides valid student import rows using the batch import field names', () => {
    const rows = readCsvRows('data/students-valid.csv');

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      matricule: 'TEST-2026-001',
      firstName: 'Amina',
      lastName: 'Exemple',
      email: 'amina@example.invalid',
    });
  });

  it('provides invalid student rows for validation tests', () => {
    const rows = readCsvRows('data/students-invalid.csv');

    expect(rows).toHaveLength(3);
    expect(rows[1].matricule).toBe('');
    expect(rows[2].email).not.toContain('@');
  });

  it('provides valid diploma import rows using the batch import field names', () => {
    const rows = readCsvRows('data/diplomas-valid.csv');
    const issueDate = XLSX.SSF.parse_date_code(Number(rows[0].issueDate));

    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      studentMatricule: 'TEST-2026-001',
      diplomaTitle: 'Licence de test',
      fieldOfStudy: 'Informatique',
    });
    expect(issueDate).toMatchObject({ y: 2026, m: 6, d: 30 });
  });

  it('provides schema-shaped sample records and an explicitly fictional document', () => {
    const records = JSON.parse(fs.readFileSync(path.join(assetsDirectory, 'data/sample-records.json'), 'utf8'));
    const document = fs.readFileSync(path.join(assetsDirectory, 'documents/sample-certificate.html'), 'utf8');

    expect(records.student.email).toMatch(/@example\.invalid$/);
    expect(records.request.status).toBe('PENDING');
    expect(records.certificate.publicIdentifier).toBe('TEST-CERT-0001');
    expect(document).toContain('DOCUMENT FICTIF');
    expect(document).toContain('TEST-CERT-0001');
  });

  it('provides an unsupported upload fixture', () => {
    const filePath = path.join(assetsDirectory, 'uploads/unsupported-upload.txt');

    expect(path.extname(filePath)).toBe('.txt');
    expect(fs.readFileSync(filePath, 'utf8')).toContain('intentionally plain text');
  });
});
