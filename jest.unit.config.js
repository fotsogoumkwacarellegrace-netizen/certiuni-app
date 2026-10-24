module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json', diagnostics: false }] },
  testMatch: ['<rootDir>/tests/unit/**/*.spec.ts'],
  collectCoverageFrom: [
    'src/common/utils/crypto.util.ts',
    'src/common/utils/qr.util.ts',
    'src/common/utils/catchAsync.ts',
    'src/common/utils/responseFormatter.ts',
    'src/common/filters/http-exception.filter.ts',
    'src/errors/app.error.ts',
    'src/lib/jwt.ts',
    'src/lib/httpError.ts',
    'src/services/crypto.service.ts',
    'src/services/qr.service.ts',
  ],
  coverageReporters: ['text', 'lcov'],
  coverageThreshold: { global: { branches: 55, functions: 65, lines: 70, statements: 70 } },
  moduleNameMapper: {
    '^@auth/(.*)$': '<rootDir>/src/common/$1',
    '^@config/(.*)$': '<rootDir>/src/config/$1',
    '^@common/(.*)$': '<rootDir>/src/common/$1',
    '^@modules/(.*)$': '<rootDir>/src/modules/$1',
    '^@services/(.*)$': '<rootDir>/src/services/$1',
    '^@utils/(.*)$': '<rootDir>/src/common/utils/$1',
    // @nestjs/bullmq est ESM-only : stub CJS pour éviter le crash de parse.
    '^@nestjs/bullmq$': '<rootDir>/test/mocks/nestjs-bullmq.mock.js',
    // @nestjs/swagger est ESM-only : stub CJS pour les tests.
    '^@nestjs/swagger$': '<rootDir>/test/mocks/nestjs-swagger.mock.js',
  },
  testPathIgnorePatterns: ['/node_modules/'],
  // Windows + transports winston : on limite les workers pour éviter les
  // SIGTERM de workers (pression mémoire) pendant la fin de suite.
  maxWorkers: 2,
  // Forcer la sortie uniquement en fin de run (handles ouverts winston).
  forceExit: true,
};