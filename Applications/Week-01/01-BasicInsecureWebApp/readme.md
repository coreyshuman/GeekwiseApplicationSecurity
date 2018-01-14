# Basic Insecure Web App
## Application Security Week 01

A simple Node Express web application with Postgres database.  
This application uses Docker to run a database, API server, and web front-end in 3 separate containers.

### Running the Application
To start the application, run the following command in a terminal: `docker-compose up`  
Use a web browser and navigate to `http://localhost:8080` to view the web interface.

### Active API Endpoints
Import the postman configuration in `postman-config` to easily navigate and test the API endpoints.


GET http://localhost:3000/api/car  
- Retrieve an array of all car objects.  
POST http://localhost:3000/api/car
- Insert a new car object.  
GET http://localhost:3000/api/car/:id  
- Get a single car object.  
PUT http://localhost:3000/api/car/:id  
- Update a car object.  
DELETE http://localhost:3000/api/car/:id  
- Delete a car object (using soft delete in this case).

### Project Layout
- database
  - Contains the Dockerfile and sql scripts to initialize the Postgres container.
- front-end
  - Contains the HTML, CSS, and JS files for the web front-end
- server
  - Contains the Server API in the form of a Node Express app.
- postman-config
  - Contains an exported Postman configuration. Use the `Import` function in Postman to load this configuration.