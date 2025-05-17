import * as crypto from 'crypto';

export function generateToken(): string {
  return crypto.randomUUID().replace(/-/g, '');
}
