import { APIGatewayProxyEvent, Handler } from "aws-lambda"
import { TWITTER_CONSUMER_KEY, TWITTER_CONSUMER_SECRET } from "./constants/Env"
import { createTweet } from "./infrastructure/Api"
import {
  createAllowCORSResponse,
  createFailedResponse,
  createSuccessResponse,
  Response,
} from "./interfaces/Response"

type Request = {
  access_token_key: string
  access_token_secret: string
  tweet: string
}

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

  try {
    await createTweet({
      access_token_key: request.access_token_key,
      access_token_secret: request.access_token_secret,
      consumer_key: TWITTER_CONSUMER_KEY,
      consumer_secret: TWITTER_CONSUMER_SECRET,
      tweet: request.tweet,
    })
  } catch (error) {
    console.log(error)
    return createFailedResponse(500, error)
  }

  return createSuccessResponse({
    result: "succeeded",
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

  const { access_token_key } = parsedBody
  if (!access_token_key) {
    errors.push(
      `Error: Invalid request body. access_token_key=${access_token_key ||
        "undefined"}`
    )
  }
  const { access_token_secret } = parsedBody
  if (!access_token_secret) {
    errors.push(
      `Error: Invalid request body. access_token_secret=${access_token_secret ||
        "undefined"}`
    )
  }
  const { tweet } = parsedBody
  if (!tweet) {
    errors.push(`Error: Invalid request body. tweet=${tweet || "undefined"}`)
  }

  return errors
}
