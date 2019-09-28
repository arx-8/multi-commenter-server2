import { APIGatewayProxyEvent, Handler } from "aws-lambda"

type Response = {
  statusCode: number
  headers: {
    [key: string]: string
  }
  body: string
}

export const handler: Handler<APIGatewayProxyEvent, Response> = async (
  event,
  context
) => {
  console.log(event, context)
  console.log("--------------------------------------")

  return {
    statusCode: 200,
    headers: {
      "content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT",
    },
    body: JSON.stringify({
      message: `Hello world ${Math.floor(Math.random() * 10)}`,
    }),
  }
}
