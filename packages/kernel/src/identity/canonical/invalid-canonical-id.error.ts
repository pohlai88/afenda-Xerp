export class InvalidCanonicalIdError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidCanonicalIdError";
  }
}
