export function databaseUrlForDriver(value: string): string {
  const url = new URL(value);
  const isLoopback = ['localhost', '127.0.0.1', '[::1]'].includes(url.hostname);

  // MySQL 8 can require a full RSA authentication handshake after restarting.
  // Trust key retrieval only on this computer; preserve explicit connection options.
  if (isLoopback && !url.searchParams.has('allowPublicKeyRetrieval')) {
    url.searchParams.set('allowPublicKeyRetrieval', 'true');
  }

  return url.toString();
}
