# multi-commenter-server

WIP

## Quick Start

```sh
npm i
npm start
```

```http
# 1. Get OAuth tokens
POST http://localhost:9000/.netlify/functions/oauth_tokens_create
Content-Type: application/json

{
    "callback_url": "http://localhost"
}

# 2. Get Access tokens
POST http://localhost:9000/.netlify/functions/access_tokens_create
Content-Type: application/json

{
    "callback_url": "http://localhost",
    "oauth_token_secret": "",
    "oauth_token": "",
    "oauth_verifier": ""
}

# 3. Post tweet
POST http://localhost:9000/.netlify/functions/statuses_update
Content-Type: application/json

{
    "access_token_key": "",
    "access_token_secret": "",
    "tweet": "hello twitter #aaa"
}
```
