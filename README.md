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
        - TODO: Redis use for caching the response for reducing the DB calls
        - TODO: Refresh Token 
        - TODO: Jest Unit Testing ( Because of running out of time i have not done TODO list) 

  #### Steps for running the api server
    - pull the code from github
    - npm install
    - npm run dev (run in developement mode with single core)
    - npm run prod (run in production mode with multi core)
    - bydefault it is running on http://localhost:3000
    - api document is running on http://localhost:3000/api-docs  

  #### System Confriguration   
    -installed mongodb
    -node version 18
    -postman (for testing API)