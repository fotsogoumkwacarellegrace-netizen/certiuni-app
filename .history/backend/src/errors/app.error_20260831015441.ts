export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Erreur opérationnelle prévisible

    Error.captureStackTrace(this, this.constructor);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Requête invalide.') {
    super(message, 400);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Accès non autorisé. Authentification requise.') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Accès interdit. Droits insuffisants.') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Ressource introuvable.') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflit avec une ressource existante.') {
    super(message, 409);
  }
}

export class InternalServerError extends AppError {
  constructor(message = 'Une erreur interne du serveur est survenue.') {
    super(message, 500);
  }
}

// export class AppError extends Error {
//     public readonly statusCode: number;
//     public readonly isOperational: boolean;

//     constructor(message: string, statusCode = 400, isOperational = true) {
//         super(message);
//         this.statusCode = statusCode;
//         this.isOperational = isOperational;
//         Object.setPrototypeOf(this, new.target.prototype);
//         Error.captureStackTrace(this, this.constructor);
//     }
// }