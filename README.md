# Blogging - Nodejs - Api

## configured the production-level-api-setup

#### Project Structure (Based on Package by feature for scale up)

        Node-API
            -config
            -logs
            -src
                -modules
                    -authentication
                    -common
                    -post
                    -users
                        __test__
                            -login.test.js
                        -usersController.js
                        -usersModel.js
                        -usersService.js
                        -usersQueries.js
                    -todos
                -app
                -router
            -package.json
            -blogging-api-postman (Postman Collection)

## This apis is fully production ready

#### Some few production ready steps followed

    -Token management with cookies http only security
    -Production level errors management with Winston logger
    -Rate limiter for 100 request in 15 min/user
    -Swagger API documentation or POSTMAN collection files for api requests
    -Utilization of maximum cores of cpu with clusters
    -Helmet lib used for security threads
    -Refresh Token and Access Token implementation
    -Redis using to store refresh Token
    -Jest and supertest used for unit testing 
    - TODO: Redis use for caching the response for reducing the DB calls
    - Refresh Token
    - TODO: Jest Unit Testing ( Because of running out of time i have not done TODO list)

#### Steps for running the api server

    - pull the code from github from master branch
    - npm install
    - npm run dev (run in developement mode with single core)
    - npm run prod (run in production mode with multi core)
    - bydefault it is running on http://localhost:3000
    - api document is running on http://localhost:3000/api-docs
    - import blogging.postman_collection.json file in postMan and try apis
    - npm run test (for testing api's)

#### System Confriguration

    -installed mongodb
    -installed redis
    -node version 18
    -postman (for testing API)
