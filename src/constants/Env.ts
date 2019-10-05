import dotenv from "dotenv"
import dotenvExpand from "dotenv-expand"
import { ConsumerKey, ConsumerSecret } from "../domain/Auth"

dotenvExpand(dotenv.config())

export const TWITTER_CONSUMER_KEY = process.env
  .TWITTER_CONSUMER_KEY as ConsumerKey
export const TWITTER_CONSUMER_SECRET = process.env
  .TWITTER_CONSUMER_SECRET as ConsumerSecret
