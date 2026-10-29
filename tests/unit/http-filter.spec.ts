import { HttpExceptionFilter } from '../../src/common/filters/http-exception.filter';

function host(url = '/x', method = 'GET') {
  const json = jest.fn();
  const status = jest.fn(() => ({ json }));
  const res = { status } as never;
  const req = { url, method, headers: {} } as never;
  return { res, req, json, status, host: { switchToHttp: () => ({ getResponse: () => res, getRequest: () => req }) } as never };
}

describe('HttpExceptionFilter', () => {
  it('maps P2002 to 409', () => {
    const f = new HttpExceptionFilter();
    const { host: h, status, json } = host();
    const err = Object.assign(new Error('dup'), { code: 'P2002', meta: { target: ['email'] } });
    f.catch(err, h);
    expect(status).toHaveBeenCalledWith(409);
    expect(json).toHaveBeenCalled();
  });
  it('maps P2025 to 404', () => {
    const f = new HttpExceptionFilter();
    const { host: h, status } = host();
    f.catch(Object.assign(new Error('nf'), { code: 'P2025' }), h);
    expect(status).toHaveBeenCalledWith(404);
  });
  it('500 default with fail/error envelope', () => {
    const f = new HttpExceptionFilter();
    const { host: h, status, json } = host();
    f.catch(new Error('boom'), h);
    expect(status).toHaveBeenCalledWith(500);
    const body = json.mock.calls[0][0];
    expect(body.status).toBe('error');
    expect(body.timestamp).toBeDefined();
  });
});
