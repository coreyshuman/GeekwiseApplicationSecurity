MyBlogApp.onload( () => {
  // event handler for login action
  MyBlogApp.resetPasswordHandler = function( e ) {
    e.preventDefault();
    const form = document.querySelector( "form#reset-password-form" );
    let email = form.elements.email.value;
    let password = form.elements.password.value;
    let passwordAgain = form.elements.passwordAgain.value;
    let token = form.elements.token.value;

    if ( password !== passwordAgain ) {
      MyBlogApp.toast( 'danger', 'Your passwords do not match.' );
      return;
    }
    MyBlogApp.spin();
    MyBlogApp.apiRequest( 'POST', '/user/reset-password', {
        token: token,
        email: email,
        password: password
      },
      ( status, data ) => {
        MyBlogApp.spinStop();
        if ( status === 200 ) {
          MyBlogApp.toast( 'success', data.message );
        } else {
          MyBlogApp.toast( 'danger', data.message );
        }
      } );
  }
  // setup the event handler
  document.getElementById( 'resetPasswordSubmit' )
    .addEventListener( 'click', MyBlogApp.resetPasswordHandler );
} );
