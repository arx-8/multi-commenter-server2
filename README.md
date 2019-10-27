[![Netlify Status](https://api.netlify.com/api/v1/badges/512be369-c751-4b63-ba8b-0dba4be84f51/deploy-status)](https://app.netlify.com/sites/multi-commenter-server2/deploys)

---

# multi-commenter-server

## Overview

- This repository for Back-end of `multi-commenter`.
- This API is deployed to [Netlify functions](https://docs.netlify.com/functions/overview/).
- See Front-end docs for details: <https://github.com/arx-8/multi-commenter>

## For developer

### Quick start

```sh
cp -f .env.example .env
npm i
npm start
```

### Available Scripts

In the project directory, you can run:

#### `npm start`

- Runs the API on <http://localhost:9000>
- Click here for details: <https://github.com/netlify/netlify-lambda#netlify-lambda-serve-legacy-command>

#### `npm run lint`

Type check only. (No eslint. No implemented yet.)

#### `npm run build`

for deploy to netlify.

#### Try

- Try to call REST API.
- The following script is in [VSCode REST Client](https://marketplace.visualstudio.com/items?itemName=humao.rest-client) format.

```http
# 1. Get OAuth tokens
POST http://localhost:9000/.netlify/functions/oauth_tokens_create
Content-Type: application/json

{
    "callback_url": "http://localhost/twitter-auth-callback"
}

# 2. Get Access tokens (Get `oauth_verifier` by authenticate_url)
POST http://localhost:9000/.netlify/functions/access_tokens_create
Content-Type: application/json

{
    "callback_url": "http://localhost/twitter-auth-callback",
    "oauth_token_key": "xxx",
    "oauth_token_secret": "xxx",
    "oauth_verifier": "xxx"
}

# 3. Post tweet
POST http://localhost:9000/.netlify/functions/statuses_update
Content-Type: application/json

{
    "access_token_key": "xxx",
    "access_token_secret": "xxx",
    "tweet": "hello twitter #aaa"
}
```

```http
# 1. Get OAuth tokens
POST https://multi-commenter-server2.netlify.com/.netlify/functions/oauth_tokens_create
Content-Type: application/json

{
    "callback_url": "https://multi-commenter.netlify.com/twitter-auth-callback"
}

# 2. Get Access tokens (Get `oauth_verifier` by authenticate_url)
POST https://multi-commenter-server2.netlify.com/.netlify/functions/access_tokens_create
Content-Type: application/json

{
    "callback_url": "https://multi-commenter.netlify.com/twitter-auth-callback",
    "oauth_token_key": "xxx",
    "oauth_token_secret": "xxx",
    "oauth_verifier": "xxx"
}

# 3. Post tweet
POST https://multi-commenter-server2.netlify.com/.netlify/functions/statuses_update
Content-Type: application/json

{
    "access_token_key": "xxx",
    "access_token_secret": "xxx",
    "tweet": "hello twitter prod #aaa"
}
```
