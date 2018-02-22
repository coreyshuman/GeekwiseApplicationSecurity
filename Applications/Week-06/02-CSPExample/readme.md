# Content-Security-Policy Example
### Application Security And Hardening
**Week 06** [View Lecture Notes](../../../LectureNotes/Week-06)

This simple app demonstrates using the `Content-Security-Policy` to
control what source is allowed in an iframe. I am loading `http://coreyshuman.com` in an iframe on the page.

If you navigate to `http://localhost:8050` you will see the iframe load.

If you navigate to `http://localhost:8050/csp` you will see the iframe refuse to load due to the added header: `Content-Security-Policy: child-src 'self'`.

Additionally, I am using the `report-uri` function of CSP to send an error report to `/error` whenever a CSP violation occures. You will see the error printed in the console (colored magenta).


### Running the Application
To start the application, run the following command in a terminal: `docker-compose up`  
Use a web browser and navigate to `http://localhost:8050` to view the web interface.

