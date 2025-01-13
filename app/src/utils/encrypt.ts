const Cryptr = require('cryptr');

export function decrypt(encryptedData: string, encryptionKey: string): string {
  const cryptr = new Cryptr(encryptionKey);
  return cryptr.decrypt(encryptedData);
}

export function encrypt(data: string, encryptionKey: string): string {
  const cryptr = new Cryptr(encryptionKey);
  return cryptr.encrypt(data);
}