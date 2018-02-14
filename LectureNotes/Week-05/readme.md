# Week 5 - Authorization Cont. and Cross-Site Request Forgery (CSRF)
### Application Security And Hardening

[Return Home](../../../../)  

[View Lecture Notes](http://coreyshuman.github.io/GeekwiseApplicationSecurity/LectureNotes/Week-05)  

### Goals
- Compare single-server MVC-style applications and multi-server API-based applications
- Explore Cross-Site Request Forgery attacks
- Continue investigating Cookies and Tokens for user authorization

### Topics
- Cross-Site Request Forgery (CSRF)
- Authorization
  - Tokens
  - Cookies

### Applications
- [Week 05 - Insecure Blog App Part 4](../../Applications/Week-05/01-BasicBlogAppPart04)
  - A work-in-progress blogging application with basic user authentication and authorization
  - This week we've added authorization via cookies and tokens
- [CSRF Example](../../Applications/Week-05/02-CSRFExample)
  - This example app performs a CSRF attack on our blogging app when using cookies to authorize the user