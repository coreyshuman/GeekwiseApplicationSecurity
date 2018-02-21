// event handler for login action
MyBlogApp.loginHandler = function( e ) {
  e.preventDefault();
  const form = document.querySelector( "form#login-form" );
  let email = form.elements.email.value;
  let password = form.elements.password.value;
  MyBlogApp.spin();
  MyBlogApp.apiRequest( 'POST', '/user/login', { email: email, password: password }, ( status, data ) => {
    if ( status === 200 ) {
      MyBlogApp.login( data.data );
      // start cookie verification
      form.submit();
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
window.onload = function() {
  document.getElementById( 'loginSubmit' )
    .addEventListener( 'click', MyBlogApp.loginHandler );
}
