module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testEnvironment: 'node',
  transform: { '^.+\\.tsx?$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.json', diagnostics: false }] },
  testMatch: ['<rootDir>/tests/integration/**/*.spec.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.spec.ts', '!src/**/*.module.ts', '!src/main.ts'],
  coverageReporters: ['text', 'lcov'],
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
  testTimeout: 30000,
  // ioredis/winston maintiennent des handles ouverts : on force la sortie
  // une fois les tests terminés pour éviter que Jest reste bloqué infiniment.
  forceExit: true,
};