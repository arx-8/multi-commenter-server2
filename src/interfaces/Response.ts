export type Response = {
  statusCode: number
  headers: {
    [key: string]: string
  }
  body: string
}

const COMMON_HEADER = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,HEAD,OPTIONS",
  "Access-Control-Allow-Headers": "content-type",
  "Access-Control-Max-Age": "3600",
}

export const createAllowCORSResponse = (): Response => {
  return {
    statusCode: 200,
    headers: COMMON_HEADER,
    body: "ok",
  }
}

type SuccessBody = {
  [key: string]: any
}

export const createSuccessResponse = (body: SuccessBody): Response => {
  return {
    statusCode: 200,
    headers: COMMON_HEADER,
    body: JSON.stringify(body),
  }
}

type FailedBody = {
  errors: any[]
}

/**
 * @param body Twitter API からのレスポンスが string の JSON であり、変換せずに受け取れるようにするため string を許可している
 */
export const createFailedResponse = (
  statusCode: number,
  body: FailedBody | string
): Response => {
  let strBody: string
  if (typeof body === "string") {
    strBody = body
  } else {
    strBody = JSON.stringify(body)
  }

  return {
    statusCode,
    headers: COMMON_HEADER,
    body: strBody,
  }
}
