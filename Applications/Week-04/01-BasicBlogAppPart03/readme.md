# Basic Insecure Blogging Application Part 03
### Application Security And Hardening
**Week 04** [View Lecture Notes](../../../LectureNotes/Week-04)

A work-in-progress blogging application that we will build up in the coming weeks. This application is the perfect platform for us to learn and practice application security fundamentals.
This application uses Docker to run a database, API server, and web front-end in 3 separate containers.

### Running the Application
To start the application, run the following command in a terminal: `docker-compose up`  
Use a web browser and navigate to `http://localhost:8080` to view the web interface.

### Active API Endpoints
This application includes a simple RESTful API that let's us save and retrieve blog posts.
Import the postman configuration in `postman-config` to easily navigate and test the API endpoints.

- Retrieve an array of all posts.  
  - GET http://localhost:3000/api/post  
- Insert a new post. 
  - POST http://localhost:3000/api/post
- Get a single post.  
  - GET http://localhost:3000/api/post/:id  
- Update a post.  
  - PUT http://localhost:3000/api/post/:id  
- Delete a post (using soft delete in this case).
  - DELETE http://localhost:3000/api/post/:id  
- Search for posts containing certain text
  - POST http://localhost:3000/api/post/search


### Project Layout
- database
  - Contains the Dockerfile and sql scripts to initialize the Postgres container.
- front-end
  - Contains the HTML, CSS, and JS files for the web front-end
- server
  - Contains the Server API in the form of a Node Express app.
- postman-config
  - Contains an exported Postman configuration. Use the `Import` function in Postman to load this configuration.