( function() {
  /*************** spinner  *******************/
  MyBlogApp.spinnerCount = 0;
  MyBlogApp.spinnerOpts = {
    lines: 5, // The number of lines to draw
    length: 80, // The length of each line
    width: 2, // The line thickness
    radius: 22, // The radius of the inner circle
    scale: 1.3, // Scales overall size of the spinner
    corners: 1, // Corner roundness (0..1)
    color: '#2ef9a1', // CSS color or array of colors
    fadeColor: 'blue', // CSS color or array of colors
    opacity: 0.35, // Opacity of the lines
    rotate: 0, // The rotation offset
    direction: -1, // 1: clockwise, -1: counterclockwise
    speed: 1.6, // Rounds per second
    trail: 100, // Afterglow percentage
    fps: 20, // Frames per second when using setTimeout() as a fallback in IE 9
    zIndex: 2e9, // The z-index (defaults to 2000000000)
    className: 'spinner', // The CSS class to assign to the spinner
    top: '50%', // Top position relative to parent
    left: '50%', // Left position relative to parent
    shadow: '10px', // Box-shadow for the lines
    position: 'absolute' // Element positioning
  };

  MyBlogApp.spinnerTarget = document.getElementById( 'main-content' );
  MyBlogApp.loadingTarget = document.getElementById( 'loading-screen' );
  MyBlogApp.spinner = new Spinner( MyBlogApp.spinnerOpts );

  MyBlogApp.spin = function() {
    MyBlogApp.spinnerCount++;
    if ( MyBlogApp.spinnerCount === 1 ) {
      MyBlogApp.loadingTarget.style.display = 'block';
      MyBlogApp.spinner.spin( MyBlogApp.spinnerTarget );
    }
  }

  MyBlogApp.spinStop = function() {
    MyBlogApp.spinnerCount--;
    if ( MyBlogApp.spinnerCount === 0 ) {
      MyBlogApp.loadingTarget.style.display = 'none';
      MyBlogApp.spinner.stop();
    }
  }
} )();
