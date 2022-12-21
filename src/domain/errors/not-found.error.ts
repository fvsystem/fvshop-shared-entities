export class NotFoundError extends Error {
  constructor(message?: string) {
    super(message || 'Entity Not found');
    this.name = 'NotFoundError';
  }
}

export default NotFoundError;
