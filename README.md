# OAuth2 PKCE Flow in React

This is just a sample react project which implements oauth2 pkce flow from scratch without any third party sdks.
**Disclaimer:** This is not a complete solution but a project developed to keep as a reference to how pkce can 
be integrated into react

## Development

- Create an OAuth application in your favourite OAuth provider
- Create .env.local file and add the OAuth application details created above to .env.local as below
```
 VITE_TOKEN_ENDPOINT= <token_endpoint>
 VITE_AUTHORIZE_ENDPOINT= <authorization_endpoint>
 VITE_USER_INFO_ENDPOINT= <userinfo_endpoint>
 VITE_REDIRECT_URI= http://localhost:3000/login # Change http://localhost:3000 to your host if you have changed the host
 VITE_CLIENT_ID= <client_id>
 VITE_SCOPE=<space separated scope list>
 VITE_RESPONSE_TYPE= code
 VITE_GRANT_TYPE= authorization_code
```
- Run below commands to install dependencies and start the app
```
yarn
yarn run dev
```
- This will start the app at localhost:3000 if you are developing locally
