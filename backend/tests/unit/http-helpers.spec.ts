import { formatSuccessResponse, formatErrorResponse } from '../../src/common/utils/responseFormatter';
import { catchAsync } from '../../src/common/utils/catchAsync';
import { Errors } from '../../src/lib/httpError';

describe('responseFormatter', () => {
  it('success envelope', () => {
    const r = formatSuccessResponse({ a: 1 }, 'ok');
    expect(r.status).toBe('success');
    expect(r.data).toEqual({ a: 1 });
    expect(r.timestamp).toBeDefined();
  });
  it('error envelope 4xx=fail 5xx=error', () => {
    expect(formatErrorResponse('bad', [], 400).status).toBe('fail');
    expect(formatErrorResponse('boom', [], 500).status).toBe('error');
  });
});

describe('catchAsync', () => {
  it('forwards rejection to next', async () => {
    const err = new Error('boom');
    const next = jest.fn();
    const handler = catchAsync(async () => { throw err; });
    handler({} as never, {} as never, next);
    await new Promise((r) => setImmediate(r));
    expect(next).toHaveBeenCalledWith(err);
  });
});

describe('HttpError helpers', () => {
  it('codes', () => {
    expect(Errors.notFound().status).toBe(404);
    expect(Errors.forbidden().status).toBe(403);
    expect(Errors.unauthorized().status).toBe(401);
    expect(Errors.badRequest().status).toBe(400);
    expect(Errors.conflict().status).toBe(409);
  });
});
