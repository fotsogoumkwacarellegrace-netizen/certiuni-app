import { generateQrDataUrl, generateQrPngBuffer } from '../../src/common/utils/qr.util';
import { generateQrCodeDataUrl } from '../../src/services/qr.service';

describe('qr utils', () => {
  it('dataUrl PNG prefix', async () => {
    const url = await generateQrDataUrl('https://certiuni.test/v/abc');
    expect(url.startsWith('data:image/png;base64,')).toBe(true);
  }, 15000);
  it('png buffer magic bytes', async () => {
    const buf = await generateQrPngBuffer('hello');
    expect(buf[0]).toBe(0x89);
    expect(buf[1]).toBe(0x50);
  }, 15000);
  it('service dataUrl', async () => {
    const url = await generateQrCodeDataUrl('https://certiuni.test/v/xyz');
    expect(url.startsWith('data:image/png;base64,')).toBe(true);
  }, 15000);
});
