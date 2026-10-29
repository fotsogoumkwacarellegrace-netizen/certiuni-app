import { AppError, BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError, InternalServerError } from '../../src/errors/app.error';

describe('errors', () => {
  it('AppError 4xx=fail 5xx=error', () => {
    expect(new AppError('x', 400).status).toBe('fail');
    expect(new AppError('x', 500).status).toBe('error');
  });
  it('subclass codes', () => {
    expect(new BadRequestError().statusCode).toBe(400);
    expect(new UnauthorizedError().statusCode).toBe(401);
    expect(new ForbiddenError().statusCode).toBe(403);
    expect(new NotFoundError().statusCode).toBe(404);
    expect(new ConflictError().statusCode).toBe(409);
    expect(new InternalServerError().statusCode).toBe(500);
  });
  it('isOperational', () => {
    expect(new AppError('x', 400).isOperational).toBe(true);
  });
});
