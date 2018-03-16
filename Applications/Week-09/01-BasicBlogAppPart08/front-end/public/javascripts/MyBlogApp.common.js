// common api functionality

let MyBlogApp = {};
( function() {
  'use strict';
  const sessionStorage = window.sessionStorage;
  const storage = window.localStorage;
  const MODEKEY = 'AppMode';
  const JWTKEY = 'AppJwtToken';
  const SESSIONCOOKIE = 'session';

  MyBlogApp.loaded = false;
  MyBlogApp.loadFunctions = [];
  MyBlogApp.user = null;
  MyBlogApp.jwtToken = null;
  MyBlogApp.tokenData = null;
  MyBlogApp.refreshTokenOk = true;
  MyBlogApp.apiUrl = 'http://localhost:3000/api';
  MyBlogApp.apiRequest = function( method, url, payload, handler ) {
    const xhr = new XMLHttpRequest();
    let retry = true;
    if ( !handler && typeof payload === 'function' ) {
      handler = payload;
      payload = null;
    }

    xhr.open( method, MyBlogApp.apiUrl + url );
    if ( url === '/user/login' ) {
      console.log( 'user credentials' )
      xhr.withCredentials = true;
    }
    xhr.setRequestHeader( 'Content-Type', 'application/json' );
    xhr.setRequestHeader( 'Authorization', `Bearer ${MyBlogApp.token()}` );
    xhr.onload = function() {
      // if access token expired, refresh
      if ( xhr.status === 403 && MyBlogApp.refreshTokenOk ) {
        MyBlogApp.getAccessToken( ( status ) => {
          if ( status === true ) {
            // try again with new access token
            MyBlogApp.apiRequest( method, url, payload, handler );
          } else {
            // refresh token bad
            MyBlogApp.refreshTokenOk = false;
            handler( xhr.status, JSON.parse( xhr.responseText ) );
          }
        } )
      } else {
        handler( xhr.status, JSON.parse( xhr.responseText ) );
      }
    };
    xhr.send( JSON.stringify( payload ) );
  }

  MyBlogApp.getFormInput = function( formEvent, name ) {
    if ( formEvent && formEvent.srcElement ) {
      let elements = formEvent.srcElement;
      for ( let i = 0; i < elements.length; i++ ) {
        if ( elements[ i ].name === name ) {
          return elements[ i ].value;
        }
      }
      return null;
    } else {
      return null;
    }
  }

  MyBlogApp.onload = function( func ) {
    if ( MyBlogApp.loaded ) {
      func();
    } else {
      MyBlogApp.loadFunctions.push( func );
    }
  }

  MyBlogApp.finishLoading = function() {
    MyBlogApp.loaded = true;
    MyBlogApp.loadFunctions.forEach( ( func ) => {
      func();
    } );
  }

  MyBlogApp.toast = function( level, message ) {
    let toast = document.createElement( 'div' );
    let toastClose = document.createElement( 'button' );
    let toastMessage = document.createElement( 'span' );
    toast.setAttribute( 'role', 'alert' );
    toast.className = `alert alert-${level} alert-dismissible fade show`;

    toastClose.textContent = "X";
    toastClose.className = "close";
    toastClose.setAttribute( 'data-dismiss', 'alert' );
    toastClose.setAttribute( 'aria-label', 'Close' );
    toast.appendChild( toastClose );

    toastMessage.textContent = message;
    toast.appendChild( toastMessage );

    document.querySelector( "div[id='toasts']" )
      .appendChild( toast );
  }

  MyBlogApp.setCookie = function( cname, cvalue, exdays ) {
    var d = new Date();
    d.setTime( d.getTime() + ( exdays * 24 * 60 * 60 * 1000 ) );
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + "; path=/";
  }

  MyBlogApp.clearCookie = function( cname ) {
    document.cookie = `${cname}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }

  MyBlogApp.getCookie = function( cname ) {
    var name = cname + "=";
    var ca = document.cookie.split( ';' );
    for ( var i = 0; i < ca.length; i++ ) {
      var c = ca[ i ];
      while ( c.charAt( 0 ) == ' ' ) {
        c = c.substring( 1 );
      }
      if ( c.indexOf( name ) == 0 ) {
        return c.substring( name.length, c.length );
      }
    }
    return "";
  }

  MyBlogApp.isInsecurePage = function() {
    const loc = document.location.href;
    const insecure = [
      '/users/login',
      '/users/logout',
      '/users/register',
      '/users/forgot-password',
      '/users/reset-password',
      '/error/'
    ];
    for ( let i = 0; i < insecure.length; i++ ) {
      if ( loc.indexOf( insecure[ i ] ) >= 0 ) {
        return true;
      }
    }
    return false;
  }

  MyBlogApp.checkSession = function() {
    let session = null;
    try {
      session = atob( MyBlogApp.getCookie( 'session' ) );
    } catch ( e ) {
      console.log( e );
    }
    if ( session != "" ) {
      try {
        session = JSON.parse( session );
        MyBlogApp.user = JSON.parse( session.user );
        if ( MyBlogApp.user.id !== MyBlogApp.parseJwt( MyBlogApp.token() )
          .id ) {
          throw new Error( 'Ids dont match.' );
        }
        let userSpan = document.getElementById( 'username' );
        userSpan.textContent = MyBlogApp.user.username;
        document.getElementById( 'userButton' )
          .classList.remove( 'hidden' );
        document.getElementById( 'logoutButton' )
          .classList.remove( 'hidden' );
        if ( document.location.href.indexOf( '/users/login' ) > -1 ||
          document.location.href.indexOf( '/users/register' ) > -1 ) {
          document.location.href = '/';
        }
      } catch ( e ) {
        console.log( e );
        MyBlogApp.logout();
      }
    } else {
      if ( MyBlogApp.isInsecurePage() ) {
        return;
      }
      document.location.href = '/users/login';
    }
  }

  MyBlogApp.modeCheck = function() {
    const modeStatus = document.getElementById( 'modeStatus' )
      .checked;
    const mode = MyBlogApp.mode( modeStatus ? 'token' : 'cookie' );
    const cookieLabel = document.getElementsByClassName( 'label-cookie' )[ 0 ];
    const tokenLabel = document.getElementsByClassName( 'label-token' )[ 0 ];
    cookieLabel.classList.remove( 'selected' );
    tokenLabel.classList.remove( 'selected' );
    mode === 'token' ? tokenLabel.classList.add( 'selected' ) : cookieLabel.classList.add( 'selected' );
  }

  MyBlogApp.parseJwt = function( token ) {
    try {
      var base64Url = token.split( '.' )[ 1 ];
      var base64 = base64Url.replace( '-', '+' )
        .replace( '_', '/' );
      return JSON.parse( atob( base64 ) );
    } catch ( e ) {
      return null;
    }
  }

  MyBlogApp.logout = function( m ) {
    MyBlogApp.session( null );
    MyBlogApp.token( null );
    setTimeout( function() {
      document.location.href = '/users/logout' + ( m ? `?m=${m}` : '' );
    }, 200 );
  }

  MyBlogApp.token = function( tok ) {
    if ( tok ) {
      MyBlogApp.jwtToken = tok;
    } else if ( tok === null ) {
      MyBlogApp.jwtToken = null;
    }
    return MyBlogApp.jwtToken;
  }

  // Attempts to retrieve and store access token. Returns result true/false
  MyBlogApp.getAccessToken = function( callback ) {
    const xhr = new XMLHttpRequest();

    xhr.open( 'POST', MyBlogApp.apiUrl + '/user/token' );
    xhr.setRequestHeader( 'Content-Type', 'application/json' );
    xhr.withCredentials = true;
    xhr.onload = function() {
      if ( xhr.status === 200 ) {
        console.log( JSON.parse( xhr.responseText )
          .data.accessToken )
        MyBlogApp.token( JSON.parse( xhr.responseText )
          .data.accessToken );
        callback( true );
      } else {
        callback( false );
      }
    };
    xhr.send();
  }

  /// Read or clear the session
  MyBlogApp.session = function( dat ) {
    if ( dat === null ) {
      MyBlogApp.clearCookie( SESSIONCOOKIE );
    }
    return MyBlogApp.getCookie( SESSIONCOOKIE );
  }

  MyBlogApp.mode = function( mod ) {
    if ( mod ) {
      sessionStorage.setItem( MODEKEY, mod );
    } else if ( mod === null ) {
      sessionStorage.removeItem( MODEKEY );
    }
    return sessionStorage.getItem( MODEKEY );
  }

  MyBlogApp.useApi = function() {
    return MyBlogApp.mode() === 'token';
  }

  MyBlogApp.getUrlParam = function( sParam ) {
    var sPageURL = window.location.search.substring( 1 );
    var sURLVariables = sPageURL.split( '&' );
    for ( var i = 0; i < sURLVariables.length; i++ ) {
      var sParameterName = sURLVariables[ i ].split( '=' );
      if ( sParameterName[ 0 ] == sParam ) {
        return sParameterName[ 1 ];
      }
    }
    return null;
  }

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

  // *****************************************
  // Functions to run at startup.
  // *****************************************
  MyBlogApp.spin();
  document.getElementById( 'logoutButton' )
    .addEventListener( 'click', ( e ) => {
      MyBlogApp.logout();
    } );

  document.getElementById( 'modeStatus' )
    .addEventListener( 'click', ( e ) => {
      MyBlogApp.modeCheck();
    } );

  // setup mode status on startup
  document.getElementById( 'modeStatus' )
    .checked = MyBlogApp.mode() === 'token';
  MyBlogApp.modeCheck();

  // get access token
  MyBlogApp.getAccessToken( ( status ) => {
    // keep token and session cookie in sync
    if ( MyBlogApp.token() ) {
      MyBlogApp.tokenData = MyBlogApp.parseJwt( MyBlogApp.token() );
      if ( !MyBlogApp.tokenData || !MyBlogApp.tokenData.exp || Date.now() / 1000 > MyBlogApp.tokenData.exp ) {
        console.log( 'expired token.' );
        MyBlogApp.spinStop();
        MyBlogApp.logout( 'expired' );
        return;
      }
    } else {
      MyBlogApp.session( null );
    }

    if ( MyBlogApp.session() ) {
      const sesdata = MyBlogApp.session();
    } else {
      MyBlogApp.token( null );
    }

    MyBlogApp.checkSession();
    MyBlogApp.spinStop();
    MyBlogApp.finishLoading();
  } );

}() );
