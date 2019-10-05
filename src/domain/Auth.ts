import { Brand } from "../types/Utils"

export type AccessTokenKey = Brand<string, "AccessTokenKey">
export type AccessTokenSecret = Brand<string, "AccessTokenSecret">
export type ConsumerKey = Brand<string, "ConsumerKey">
export type ConsumerSecret = Brand<string, "ConsumerSecret">
export type OauthTokenKey = Brand<string, "OauthTokenKey">
export type OauthTokenSecret = Brand<string, "OauthTokenSecret">
export type OauthVerifier = Brand<string, "OauthVerifier">

export const isValidCallbackUrl = (callbackUrl?: string): boolean => {
  return !!callbackUrl && callbackUrl.startsWith("http")
}
