( function() {
  "use strict";
  MyBlogApp.fetchFeed = function() {
    MyBlogApp.spin();
    // get feed content
    const order = document.getElementById( 'order' )
      .value;
    const by = document.getElementById( 'orderBy' )
      .value;

    if ( MyBlogApp.useApi() ) {
      console.log( 'GET using API' );
      MyBlogApp.apiRequest( 'GET', `/post?order=${order}&by=${by}`, ( status, payload ) => {
        console.log( status, payload );
        MyBlogApp.spinStop();
        if ( status === 200 ) {
          MyBlogApp.postFeed( payload.data );
          MyBlogApp.spinStop();
        } else {
          MyBlogApp.toast( 'danger', payload.message ? payload.message : 'An error occured, please try again.' );
        }
      } );
    } else {
      // non-api mode
      fetch( `/post/all?order=${order}&by=${by}`, {
          credentials: 'same-origin'
        } )
        .then( function( response ) {
          if ( response.status >= 200 && response.status < 300 ) {
            return response;
          } else {
            var error = new Error( response.statusText );
            error.response = response;
            throw error;
          }
        } )
        .then( function( response ) {
          return response.json();
        } )
        .then( function( json ) {
          console.log( json )
          MyBlogApp.postFeed( json );
          MyBlogApp.spinStop();
        } )
        .catch( function( e ) {
          MyBlogApp.toast( 'danger', e.response && e.response.status === 500 ? e.response.json() : e.message );
          MyBlogApp.spinStop();
        } );
    }
  }

  MyBlogApp.postFeed = function( data ) {
    const feed = document.getElementById( 'feed' );
    const temp = document.getElementById( 'postTemplate' );
    const item = temp.content.querySelector( 'div' );
    document.getElementById( 'postCount' )
      .textContent = data.length;
    feed.innerHTML = '';
    for ( let i = 0; i < data.length; i++ ) {
      const postData = data[ i ];
      const post = document.importNode( item, true );
      post.innerHTML = post.innerHTML.replace( /\{\{title\}\}/, postData.title )
        .replace( /\{\{id\}\}/g, postData.id )
        .replace( /\{\{post\}\}/, postData.post.replace( /(\r|\n|\r\n)/g, '<br>' ) )
        .replace( /\{\{author\}\}/, postData.username )
        .replace( /\{\{created\}\}/, postData.created_at )
        .replace( /\{\{updated\}\}/, postData.updated_at );

      if ( postData.created_at !== postData.updated_at ) {
        post.querySelector( ".post-updated" )
          .classList.remove( 'hidden' );
      }
      feed.appendChild( post );
    }
  }

  function handleFeedClick( e ) {
    const el = e.target;
    const id = el.dataset.id;
    const type = el.dataset.type;

    if ( type === 'edit' ) {
      document.location.href = `/post/${id}`;
    } else if ( type === 'del' ) {
      // TODO: connect this
      document.location.href = `/post/delete/${id}`;
    }
  }

  window.onload = function() {
    console.log( 'fetch' )
    MyBlogApp.fetchFeed();
    document.getElementById( 'btnRefresh' )
      .addEventListener( 'click', MyBlogApp.fetchFeed );
    document.getElementById( 'feed' )
      .addEventListener( 'click', handleFeedClick );
  }
} )();
