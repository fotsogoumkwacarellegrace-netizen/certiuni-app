'use strict';

/**
 * Mock CJS de `@nestjs/bullmq` pour les tests Jest.
 *
 * Le paquet réel est ESM-only (`export ...`) et n'est pas transformé par
 * ts-jest (node_modules ignoré) → provoque "SyntaxError: Unexpected token
 * 'export'". Ce stub expose le même surface API utilisé par le code :
 *   - BullModule.registerQueue / registerQueueAsync / forRoot / forRootAsync
 *   - InjectQueue (decorator factory de propriété)
 *   - Processor (class decorator factory)
 *   - WorkerHost (classe à étendre)
 *   - getQueueToken, JOB_REF
 *
 * Aucune connexion Redis n'est ouverte pendant les tests.
 */

function propertyDecorator() {
  return function () {
    return undefined;
  };
}

function classDecoratorFactory() {
  return function (target) {
    return target;
  };
}

function dynamicModule(name) {
  return { module: name, providers: [], exports: [] };
}

const BullModule = {
  registerQueue: function () {
    return dynamicModule('BullModuleQueueMock');
  },
  registerQueueAsync: function () {
    return dynamicModule('BullModuleQueueMock');
  },
  forRoot: function () {
    return dynamicModule('BullModuleRootMock');
  },
  forRootAsync: function () {
    return dynamicModule('BullModuleRootMock');
  },
};

function InjectQueue(_queueName) {
  return propertyDecorator();
}

function Processor(_queueName) {
  return classDecoratorFactory();
}

class WorkerHost {
  async process() {
    throw new Error('WorkerHost.process() is mocked in tests');
  }
}

function getQueueToken(name) {
  return 'BullQueue_' + String(name);
}

const JOB_REF = '__job__';

module.exports = {
  BullModule,
  InjectQueue,
  Processor,
  WorkerHost,
  getQueueToken,
  JOB_REF,
};
