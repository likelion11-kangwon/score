import { MemoryStoredFile } from "nestjs-form-data";

export class SubmitBodyValidator {
  static validate(data: unknown): data is Record<string, string | MemoryStoredFile> {
    if (typeof data !== 'object' || data === null) return false;

    if (data.constructor !== Object) {
      return false;
    }

    for (const key in data) {
      if (typeof key !== 'string') return false;

      if (
        typeof (data as Record<string, unknown>)[key] !== 'string' &&
        !((data as Record<string, unknown>)[key] instanceof MemoryStoredFile)
      ) {
        return false;
      }
    }
    return true;
  }
}
