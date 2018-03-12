# MEANBug

Original by github.com/dbohannon  
https://github.com/coreyshuman/MEANBug

Dockerized by github.com/coreyshuman

An invoice management application build on the MEAN stack with intentional vulnerabilities used to demonstrate insecure configurations and missing or insufficient security controls.

## Initialize Database (linux)
`sudo apt-get install mongodb`

`mongoimport --db billing --collection invoices --file billing.json`

`mongoimport --db users --collection collection --file users.json`

## Run App
`npm install`

`node server.js`

## Vulnerabilities
The MEAN Bug application includes the following vulnerabilities:
* Authentication Bypass
* Query Selector Injection
* Angular Expression Injection
* Cross-Site Request Forgery (CSRF)
* Cross-Site Scripting (XSS)
* Local Storage Information Leakage
* Unsafe Session Management
* Insecure Direct Object Reference
* Verbose Errors
* and more...
