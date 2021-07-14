# Welcome to Node.js typescript boilerplate!
This boilerplate holds the very basic express server for you to be able to complete your simulation successfully. 


# Getting started
- Install dependencies
```****
cd <project_name>
npm install
```

- Start server
```
npm start
```
For auto-reload (nodemon), use:
```
npm run watch-node
```

Or you can compile and serve js files
```
npm run compile
node ./dist/server.js
```


This will start the server on port **3000**.

If everything works fine you should be able to access the `/healthcheck` endpoint and receive the following response:

![simulation preview](https://drive.google.com/uc?id=1SofJmYALWAYUoAwdizo5XIzQNwK7DgYG)

### Mock server

As part of the simulation there is a mock server that you will have to work against. In order to make sure things are as smooth as possible we've made sure that upon accessing the `/healthcheck` endpoint we're also checking whether the mock server is accessible. If it fails please **contact your interviewer ASAP**.


**Good luck!**
