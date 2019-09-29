import { APIGatewayProxyEvent, Handler } from "aws-lambda"
import { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } from "./constants/Env"
import { isValidCallbackUrl } from "./domain/Auth"
import { fetchOAuthTokens } from "./infrastructure/Api"
import {
  createAllowCORSResponse,
  createFailedResponse,
  createSuccessResponse,
  Response,
} from "./interfaces/Response"

type Request = {
  callback_url: string
}

/**
 * OAuthトークンの生成
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
    result = await fetchOAuthTokens({
      callback_url: request.callback_url,
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
    })
  } catch (error) {
    console.log(error)
    return createFailedResponse(
      error.statusCode ? error.statusCode : 500,
      error.data
    )
  }

  return createSuccessResponse({
    ...result,
    authenticate_url: `https://twitter.com/oauth/authenticate?oauth_token=${result.oauth_token_key}`,
  })
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

  return errors
}
