export function parseIdfromURI(uri: string) {
  return uri.split('/').pop()
}
