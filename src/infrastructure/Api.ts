import { OAuth } from "oauth"
import Twitter from "twitter"
import { PostStatusesUpdateResponse } from "./types/PostStatusesUpdateResponse"

type FetchOAuthTokensParams = {
  callback_url: string
  consumer_key: string
  consumer_secret: string
}
type FetchOAuthTokens = {
  oauth_token: string
  oauth_token_secret: string
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
    oauth.getOAuthRequestToken((error, oauth_token, oauth_token_secret) => {
      if (error) {
        reject(error)
        return
      }
      resolve({
        oauth_token,
        oauth_token_secret,
      })
    })
  })
}

type FetchAccessTokensParams = {
  callback_url: string
  consumer_key: string
  consumer_secret: string
  oauth_token_secret: string
  oauth_token: string
  oauth_verifier: string
}
type FetchAccessTokensResponse = {
  access_token: string
  access_token_secret: string
}

/**
 * oauth_token は使い捨て
 * accessToken を取得すると無効になるらしい
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
        params.oauth_token,
        params.oauth_token_secret,
        params.oauth_verifier,
        (error, access_token, access_token_secret) => {
          if (error) {
            reject(error)
            return
          }
          resolve({
            access_token,
            access_token_secret,
          })
        }
      )
    }
  )

  return accessTokens
}

type CreateTweetParams = {
  access_token_key: string
  access_token_secret: string
  consumer_key: string
  consumer_secret: string
  tweet: string
}

export const createTweet = async (
  params: CreateTweetParams
): Promise<PostStatusesUpdateResponse> => {
  const client = new Twitter({
    consumer_key: params.consumer_key,
    consumer_secret: params.consumer_secret,
    access_token_key: "186329838-onMKveVKuE5M1nH6hhw0ZKhkD8HnPNZW2amOUCSv",
    access_token_secret: "qgAMJzdVdqdOD66HbRB5NSm1fUIWSvwvaw3QuHBGCJMQv",
  })

  const resp = await client.post("statuses/update", {
    status: params.tweet,
  })

  return resp as any
}
