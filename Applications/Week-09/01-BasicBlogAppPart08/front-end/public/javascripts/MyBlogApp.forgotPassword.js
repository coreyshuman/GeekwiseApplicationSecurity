MyBlogApp.onload( () => {
  // event handler for login action
  console.log( 'login loaded' )
  MyBlogApp.forgotPasswordHandler = function( e ) {
    e.preventDefault();
    const form = document.querySelector( "form#forgot-password-form" );
    let email = form.elements.email.value;
    MyBlogApp.spin();
    MyBlogApp.apiRequest( 'POST', '/user/forgot-password', {
        email: email
      },
      ( status, data ) => {
        if ( status === 200 ) {
          // save access token
          MyBlogApp.spinStop();
          MyBlogApp.toast( 'success', data.message );
        } else if ( status === 404 ) {
          MyBlogApp.toast( 'danger', data.message );
          MyBlogApp.spinStop();
        } else {
          MyBlogApp.toast( 'danger', data.message );
          MyBlogApp.spinStop();
        }
      } );
  }
  // setup the event handler
  document.getElementById( 'forgotPasswordSubmit' )
    .addEventListener( 'click', MyBlogApp.forgotPasswordHandler );
} );
