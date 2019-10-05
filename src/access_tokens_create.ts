import { APIGatewayProxyEvent, Handler } from "aws-lambda"
import { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } from "./constants/Env"
import {
  isValidCallbackUrl,
  OauthTokenKey,
  OauthTokenSecret,
  OauthVerifier,
} from "./domain/Auth"
import { fetchAccessTokens } from "./infrastructure/Api"
import {
  createAllowCORSResponse,
  createFailedResponse,
  createSuccessResponse,
  Response,
} from "./interfaces/Response"

type Request = {
  callback_url: string
  oauth_token_key: OauthTokenKey
  oauth_token_secret: OauthTokenSecret
  oauth_verifier: OauthVerifier
}

/**
 * 再利用可能なアクセストークンの生成
 */
export const handler: Handler<APIGatewayProxyEvent, Response> = async (
  event
) => {
  // Allow CORS
  if (event.httpMethod === "OPTIONS") {
    return createAllowCORSResponse()
  }

  const errors = validate(event)
  if (errors.length !== 0) {
    return createFailedResponse(400, { errors })
  }

  const request = JSON.parse(event.body!) as Request

  let result
  try {
    result = await fetchAccessTokens({
      callback_url: request.callback_url,
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
      oauth_token_key: request.oauth_token_key,
      oauth_token_secret: request.oauth_token_secret,
      oauth_verifier: request.oauth_verifier,
    })
  } catch (error) {
    console.log(error)
    return createFailedResponse(500, error)
  }

  return createSuccessResponse(result)
}

/**
 * @return error reasons
 */
const validate = (event: APIGatewayProxyEvent): string[] => {
  const errors: string[] = []

  if (event.httpMethod !== "POST") {
    errors.push("Method not allowed")
    return errors
  }

  if (event.body == null || event.body.length === 0) {
    errors.push("No body")
    return errors
  }

  const parsedBody = JSON.parse(event.body) as Partial<Request>

  const { callback_url } = parsedBody
  if (!isValidCallbackUrl(callback_url)) {
    errors.push(
      `Error: Invalid request body. callback_url=${callback_url || "undefined"}`
    )
  }
  const { oauth_token_secret } = parsedBody
  if (!oauth_token_secret) {
    errors.push(
      `Error: Invalid request body. oauth_token_secret=${oauth_token_secret ||
        "undefined"}`
    )
  }
  const { oauth_token_key } = parsedBody
  if (!oauth_token_key) {
    errors.push(
      `Error: Invalid request body. oauth_token_key=${oauth_token_key ||
        "undefined"}`
    )
  }
  const { oauth_verifier } = parsedBody
  if (!oauth_verifier) {
    errors.push(
      `Error: Invalid request body. oauth_verifier=${oauth_verifier ||
        "undefined"}`
    )
  }

  return errors
}
