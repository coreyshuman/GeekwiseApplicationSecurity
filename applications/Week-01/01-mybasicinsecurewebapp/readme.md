# Basic Insecure Web App
### Application Security And Hardening
**Week 01** [View Lecture Notes](../../../LectureNotes/Week-01)

A simple Node Express web application with Postgres database.  
This application uses Docker to run a database, API server, and web front-end in 3 separate containers.

### Running the Application
To start the application, run the following command in a terminal: `docker-compose up`  
Use a web browser and navigate to `http://localhost:8080` to view the web interface.

### Active API Endpoints
This application includes a simple RESTful API that let's us save and retrieve car Make and Model information.
Import the postman configuration in `postman-config` to easily navigate and test the API endpoints.

- Retrieve an array of all car objects.  
  - GET http://localhost:3000/api/car  
- Insert a new car object. 
  - POST http://localhost:3000/api/car
- Get a single car object.  
  - GET http://localhost:3000/api/car/:id  
- Update a car object.  
  - PUT http://localhost:3000/api/car/:id  
- Delete a car object (using soft delete in this case).
  - DELETE http://localhost:3000/api/car/:id  


### Project Layout
- database
  - Contains the Dockerfile and sql scripts to initialize the Postgres container.
- front-end
  - Contains the HTML, CSS, and JS files for the web front-end
- server
  - Contains the Server API in the form of a Node Express app.
- postman-config
  - Contains an exported Postman configuration. Use the `Import` function in Postman to load this configuration.