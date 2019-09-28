import dotenv from "dotenv"
import dotenvExpand from "dotenv-expand"

dotenvExpand(dotenv.config())

export const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY!
export const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET!
