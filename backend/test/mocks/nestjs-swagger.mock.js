'use strict';

/**
 * Mock CJS de `@nestjs/swagger` pour les tests Jest.
 *
 * Le paquet réel (`dist/index.js`) est ESM-only → "Cannot use import
 * statement outside a module". Tous les symboles exportés sont des
 * decorator factories : on renvoie une fonction compatible avec les
 * usages suivants :
 *   - Décorateur d'arg :     @ApiTags('x')      → factory renvoie le decorator
 *   - Décorateur sans arg :  @ApiTags            → renvoie la classe intacte
 *   - Classe wrapper :       class X extends PartialType(Y) {}
 */

function makeDecoratorFactory(name) {
  const fn = function (...args) {
    // Usage nu comme class decorator : @ApiTags — renvoyer la classe cible.
    if (args.length === 1 && (typeof args[0] === 'function' || (args[0] && typeof args[0] === 'object' && args[0].prototype && !Array.isArray(args[0])))) {
      const first = args[0];
      if (typeof first === 'function') return first;
    }
    // Usage factory : ApiTags('x'), ApiProperty({...}) → renvoyer un decorator.
    return function (target) {
      return typeof target === 'function' ? target : undefined;
    };
  };
  Object.defineProperty(fn, 'name', { value: name });
  return fn;
}

const cache = new Map();

module.exports = new Proxy(
  {},
  {
    get(_target, prop) {
      if (prop === '__esModule') return false;
      if (typeof prop !== 'string') return undefined;
      if (prop === 'default') return module.exports;
      if (!cache.has(prop)) cache.set(prop, makeDecoratorFactory(prop));
      return cache.get(prop);
    },
    has() {
      return true;
    },
  },
);
