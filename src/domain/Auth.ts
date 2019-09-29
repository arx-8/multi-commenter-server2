export const isValidCallbackUrl = (callbackUrl?: string): boolean => {
  return !!callbackUrl && callbackUrl.startsWith("http")
}
