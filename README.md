# api.hashpass-v3
A stateless password generator.

## Whats the api for
The api provides a way to sync the services that have a password generated with the frontend across devices. All of the password generation is handled on the client side using sha256.
```js
sha256(`${userSecret} + ${serviceToGeneratePasswordFor}`)
```
This method means the backend can never access any of your passwords.
The information stored on the backend cannot be used to crack into any of your accounts

# Using the api
## Creating a user
```ts
// POST /user
body:
{
  username: string
  password: string // the frontend sends a generated password using a similar method as mentioned above
}
```

## Login
```ts
// POST /user/login
body:
{
  username: string
  password: string
}
```

## refresh access token
```ts
// POST /user/refresh
body:
{
  refresh_token: string
}
```

## Get User information
```ts
// GET /user
header:
{
  Authorization: bearer access_token
}
```
