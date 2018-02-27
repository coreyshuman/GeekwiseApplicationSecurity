# Payload Rx - A Session Hijacking Tool
### Application Security And Hardening
**Week 07** [View Lecture Notes](../../../LectureNotes/Week-07)

This application demonstrates how a "trusted" source can be hijacked to server malicious code.
The project simulates a CDN hosting jQuery which was modified to include malicious code to steal the access tokens and cookies from our Secure Blog application.

### Running the Application
The code files must be hosted from a server that can server PHP files. You must also configure a database to work with this app.

### Files
- jquery.js
  - The simulated malicious jQuery CDN
- rx.php
  - The receiving endpoint for the payload with our stolen credentials
- view.php
  - This file lists the stolen credentials stored in the database