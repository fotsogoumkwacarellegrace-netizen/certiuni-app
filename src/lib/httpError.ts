/**
 * HttpError — remplace les exceptions NestJS
 * (@nestjs/common → NotFoundException, ForbiddenException, BadRequestException, …).
 *
 * Un middleware de gestion d'erreurs global (défini dans `main.ts`) intercepte
 * cette classe et renvoie une réponse JSON standardisée au format API.
 */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
    this.name = 'HttpError';
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export const Errors = {
  notFound(message = 'Ressource introuvable.') {
    return new HttpError(404, 'NOT_FOUND', message);
  },
  forbidden(message = 'Accès refusé : privilèges insuffisants.') {
    return new HttpError(403, 'FORBIDDEN', message);
  },
  badRequest(message = 'Requête invalide.', code = 'BAD_REQUEST') {
    return new HttpError(400, code, message);
  },
  conflict(message = 'Conflit métier.', code = 'CONFLICT') {
    return new HttpError(409, code, message);
  },
  unauthorized(message = 'Accès non autorisé.') {
    return new HttpError(401, 'UNAUTHORIZED', message);
  },
  internal(message = 'Erreur interne du serveur.') {
    return new HttpError(500, 'INTERNAL_SERVER_ERROR', message);
  },
};
