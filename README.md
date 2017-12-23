Cryptosis
===

Prerequisites
===

1. Install `NodeJS 8` via `nvm` https://github.com/creationix/nvm
2. Install and setup `neo4j` 
https://neo4j.com/download/neo4j-desktop/?edition=desktop&flavour=osx&release=1.0.6
3. Install Yarn https://yarnpkg.com/lang/en/docs/install/

Setup
===

**API**
1. Goto the `js/api` project and run `cp .env.sample .env`
2. Update the environement variables in the file (add your own neo4j password from step 2)

```
NODE_ENV=development
SERVER_PORT=5000
FB_LOGIN_URL=https://graph.facebook.com/me?fields=email,name,first_name,last_name,picture&access_token&access_token
GOOGLE_LOGIN_URL=https://www.googleapis.com/plus/v1/people/me?access_token
DB_URL=bolt://localhost:7687
DB_USERNAME=neo4j
DB_PASSWORD=
SESSION_KEY=
JWT_SECRET=
JWT_LIFE_SPAN="7d"
```
3. `yarn install` 
4. `yarn dev`

**UI**
1. Goto `js/ui` and run `cp .env.sample .env` and paste the following env variable

```
NODE_ENV=development
GOOGLE_CLIENT_ID=
FB_CLIENT_ID=
API_URL=http://127.0.0.1:5000
PORT=3000
ACCESS_TOKEN_KEY=@cryptosis:access_token
USER_INFO=@cryptosis:user_info
```
2. `yarn install`
3. `yarn start:web`
4. Open browser `http://localhost:3000`

