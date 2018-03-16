MyBlogApp.onload( () => {
  // event handler for login action
  MyBlogApp.resetPasswordHandler = function( e ) {
    e.preventDefault();
    const form = document.querySelector( "form#reset-password-form" );
    let email = form.elements.email.value;
    let password = form.elements.password.value;
    let passwordAgain = form.elements.passwordAgain.value;
    MyBlogApp.spin();
    MyBlogApp.apiRequest( 'POST', '/user/reset-password', {
        token: token,
        email: email,
        password: password,
        password: passwordAgain
      },
      ( status, data ) => {
        if ( status === 200 ) {
          // save access token
          MyBlogApp.toast( 'success', data.message );
        } else if ( status === 404 ) {
          MyBlogApp.toast( 'danger', data.message );
          MyBlogApp.spinStop();
        } else {
          MyBlogApp.toast( 'danger', 'An error occured, please try again.' );
          MyBlogApp.spinStop();
        }
      } );
  }
  // setup the event handler
  document.getElementById( 'resetPasswordSubmit' )
    .addEventListener( 'click', MyBlogApp.resetPasswordHandler );
} );
