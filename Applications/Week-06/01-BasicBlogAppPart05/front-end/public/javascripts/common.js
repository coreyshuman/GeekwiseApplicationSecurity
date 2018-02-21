// common api functionality

let MyBlogApp = {};
( function() {
  'use strict';
  const sessionStorage = window.sessionStorage;
  const storage = window.localStorage;
  const MODEKEY = 'AppMode';
  const JWTKEY = 'AppJwtToken';
  const SESSIONCOOKIE = 'session';

  MyBlogApp.user = null;
  MyBlogApp.tok = null;
  MyBlogApp.apiUrl = 'http://localhost:3000/api';
  MyBlogApp.apiRequest = function( method, url, payload, handler ) {
    const xhr = new XMLHttpRequest();
    if ( !handler && typeof payload === 'function' ) {
      handler = payload;
      payload = null;
    }

    xhr.open( method, MyBlogApp.apiUrl + url );
    xhr.setRequestHeader( 'Content-Type', 'application/json' );
    xhr.setRequestHeader( 'Authorization', `Bearer ${MyBlogApp.token()}` );
    xhr.onload = function() {
      handler( xhr.status, JSON.parse( xhr.responseText ) );
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

  MyBlogApp.login = function( data ) {
    MyBlogApp.token( data.token );
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
      storage.setItem( JWTKEY, tok );
    } else if ( tok === null ) {
      storage.removeItem( JWTKEY );
    }
    return storage.getItem( JWTKEY );
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

  // *****************************************
  // Functions to run at startup.
  // *****************************************
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

  // keep token and session cookie in sync
  if ( MyBlogApp.token() ) {
    MyBlogApp.tok = MyBlogApp.parseJwt( MyBlogApp.token() );
    if ( !MyBlogApp.tok || !MyBlogApp.tok.exp || Date.now() / 1000 > MyBlogApp.tok.exp ) {
      console.log( 'expired token.' );
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

}() );
