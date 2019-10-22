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
