MyBlogApp.onload( () => {
  "use strict";
  console.log( 'feed loaded' )
  MyBlogApp.fetchFeed = function() {
    MyBlogApp.spin();
    // get feed content
    const page = $( '#paginator' );
    const order = document.getElementById( 'order' )
      .value;
    const by = document.getElementById( 'orderBy' )
      .value;

    let pageLimit = 10;
    let currPage = page.pagination( 'getCurrentPage' );
    console.log( currPage )

    if ( MyBlogApp.useApi() ) {
      console.log( 'GET using API' );
      MyBlogApp.apiRequest( 'GET', `/post?order=${order}&by=${by}`, ( status, payload ) => {
        console.log( status, payload );
        MyBlogApp.spinStop();
        if ( status === 200 ) {
          MyBlogApp.postFeed( payload.data );
          MyBlogApp.spinStop();
        } else {
          MyBlogApp.toast( 'danger', payload.message ? payload.message :
            'An error occured, please try again.' );
        }
      } );
    } else {
      // non-api mode
      fetch( `/post/all?order=${order}&by=${by}&pl=${pageLimit}&p=${currPage}`, {
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
          MyBlogApp.updatePaginator( json );
          MyBlogApp.postFeed( json );
          MyBlogApp.spinStop();
        } )
        .catch( function( e ) {
          MyBlogApp.toast( 'danger', e.response && e.response.status === 500 ? e.response.json() : e.message );
          MyBlogApp.spinStop();
        } );
    }
  }

  MyBlogApp.updatePaginator = function( data ) {
    const page = $( '#paginator' );
    page.pagination( 'updateItems', data.count );

  }

  MyBlogApp.postFeed = function( data ) {
    const feed = document.getElementById( 'feed' );
    const temp = document.getElementById( 'postTemplate' );
    const spacer = document.getElementById( 'postSpacer' );
    const item = temp.content.querySelector( 'div' );

    const s = ( data.page - 1 ) * data.pageLimit + 1;
    const f = s + data.posts.length - 1;
    const t = data.count;
    document.getElementById( 'viewCount' )
      .textContent = `Viewing ${s}-${f} of ${t}`;

    feed.innerHTML = '';
    data = data.posts;
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

      if ( postData.user_id !== MyBlogApp.user.id ) {
        const controls = post.querySelector( '.user-controls' );
        controls.parentNode.removeChild( controls );
      }

      feed.appendChild( post );
      feed.appendChild( document.importNode( spacer.content, true ) );
    }
  }

  function handleFeedClick( e ) {
    let el = e.target;
    let id = el.dataset.id;
    if ( id === undefined ) {
      el = el.parentNode;
      id = el.dataset.id;
    }
    const type = el.dataset.type;
    console.log( el, type )

    if ( type === 'edit' ) {
      document.location.href = `/post/${id}`;
    } else if ( type === 'del' ) {
      // TODO: connect this
      document.location.href = `/post/delete/${id}`;
    }
  }

  /********* feed page startup code ************/
  document.getElementById( 'btnRefresh' )
    .addEventListener( 'click', MyBlogApp.fetchFeed );
  document.getElementById( 'feed' )
    .addEventListener( 'click', handleFeedClick );

  $( '#paginator' )
    .pagination( {
      items: 100,
      itemsOnPage: 10,
      onPageClick: MyBlogApp.fetchFeed,
      cssStyle: 'dark-theme'
    } );

  console.log( 'fetch' )
  MyBlogApp.fetchFeed();

} );
