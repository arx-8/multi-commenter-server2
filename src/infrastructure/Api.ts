import { OAuth } from "oauth"
import Twitter from "twitter"
import {
  AccessTokenKey,
  ConsumerKey,
  ConsumerSecret,
  OauthTokenKey,
  OauthTokenSecret,
  OauthVerifier,
  AccessTokenSecret,
} from "../domain/Auth"
import { PostStatusesUpdateResponse } from "./types/PostStatusesUpdateResponse"

type FetchOAuthTokensParams = {
  callback_url: string
  consumer_key: ConsumerKey
  consumer_secret: ConsumerSecret
}
type FetchOAuthTokens = {
  oauth_token_key: OauthTokenKey
  oauth_token_secret: OauthTokenSecret
}

/**
 * @see http://creator.cotapon.org/articles/node-js/node_js-oauth-twitter
 * @return OAuth authenticate page url
 */
export const fetchOAuthTokens = (
  params: FetchOAuthTokensParams
): Promise<FetchOAuthTokens> => {
  const oauth = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    params.consumer_key,
    params.consumer_secret,
    "1.0",
    params.callback_url,
    "HMAC-SHA1"
  )

  return new Promise((resolve, reject) => {
    oauth.getOAuthRequestToken((error, oauth_token_key, oauth_token_secret) => {
      if (error) {
        reject(error)
        return
      }
      resolve({
        oauth_token_key: oauth_token_key as any,
        oauth_token_secret: oauth_token_secret as any,
      })
    })
  })
}

type FetchAccessTokensParams = {
  callback_url: string
  consumer_key: ConsumerKey
  consumer_secret: ConsumerSecret
  oauth_token_key: OauthTokenKey
  oauth_token_secret: OauthTokenSecret
  oauth_verifier: OauthVerifier
}
type FetchAccessTokensResponse = {
  access_token_key: AccessTokenKey
  access_token_secret: AccessTokenSecret
}

/**
 * oauth_token は使い捨て
 * access_token を取得すると無効になるらしい
 * そのため、 API コールには accessToken の方を再利用する必要がある
 */
export const fetchAccessTokens = async (
  params: FetchAccessTokensParams
): Promise<FetchAccessTokensResponse> => {
  const oauth = new OAuth(
    "https://api.twitter.com/oauth/request_token",
    "https://api.twitter.com/oauth/access_token",
    params.consumer_key,
    params.consumer_secret,
    "1.0",
    params.callback_url,
    "HMAC-SHA1"
  )

  const accessTokens = await new Promise<FetchAccessTokensResponse>(
    (resolve, reject) => {
      oauth.getOAuthAccessToken(
        params.oauth_token_key,
        params.oauth_token_secret,
        params.oauth_verifier,
        (error, access_token_key, access_token_secret) => {
          if (error) {
            reject(error)
            return
          }
          resolve({
            access_token_key: access_token_key as any,
            access_token_secret: access_token_secret as any,
          })
        }
      )
    }
  )

  return accessTokens
}

type CreateTweetParams = {
  access_token_key: AccessTokenKey
  access_token_secret: AccessTokenSecret
  consumer_key: ConsumerKey
  consumer_secret: ConsumerSecret
  tweet: string
}

export const createTweet = async (
  params: CreateTweetParams
): Promise<PostStatusesUpdateResponse> => {
  const client = new Twitter({
    consumer_key: params.consumer_key,
    consumer_secret: params.consumer_secret,
    access_token_key: params.access_token_key,
    access_token_secret: params.access_token_secret,
  })

  const resp = await client.post("statuses/update", {
    status: params.tweet,
  })

  return resp as any
}
