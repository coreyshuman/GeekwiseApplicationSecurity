$( function() {
  const self = this;
  let source = document.getElementsByTagName( 'html' )[ 0 ].innerHTML;
  //console.log(source)

  // encode html characters inside of code tags
  source = source.replace( /<pre>\s?<code.*?>([\s\S]*?)<\/code>\s?<\/pre>/g, ( match, p1 ) => {
    p1 = safe_tags_replace( p1 );
    //console.log(p1)
    return `<pre><code>${p1}</code></pre>`;
  } );

  // switch backticks to <code> block
  source = source.replace( /`(.*?)`/g, ( match, p1 ) => {
    p1 = safe_tags_replace( p1 );
    return `<code>${p1}</code>`;
  } );

  // switch double asterisks to <span class='bold'> block
  source = source.replace( /\*\*(.*)\*\*/g, ( match, p1 ) => {
    return `<span class='bold'>${p1}</span>`;
  } );

  // switch single asterisks to <em> block
  source = source.replace( /\*(.*)\*/g, ( match, p1 ) => {
    return `<em>${p1}</em>`;
  } );

  // todo - make this more efficient (currently rewrites whole DOM)
  document.getElementsByTagName( 'html' )[ 0 ].innerHTML = source;

  // generate sanitized code tags from 'code-template' scripts
  $( "script[type='template/code']" )
    .each( function( i, block ) {
      let content = safe_tags_replace( block.innerHTML );
      content = normalize_indent( content );
      const pre = $( '<pre />' );
      const code = $( '<code />' );
      code.html( content );
      block.classList.forEach( ( val ) => {
        code.addClass( val );
      } )
      code.appendTo( pre );
      pre.insertBefore( block );
    } );

  // generate table of contents
  const toc = $( "#table-of-contents" );
  if ( toc.length ) {
    $( ":header" )
      .each( ( index, el ) => {
        const ell = $( el );
        const headText = ell.text();
        const indent = ell[ 0 ].localName.substring( 1 );

        if ( indent > 3 ) {
          return;
        }

        const anc = $( '<a/>' )
          .addClass( 'ui-anchor' )
          .attr( 'name', headText )

        ell.before( $( '<br>' ) );
        ell.before( anc );

        const li = $( '<li/>' )
          .addClass( 'ui-list-' + indent )
          .appendTo( toc );
        const a = $( '<a/>' )
          .addClass( 'ui-link' )
          .addClass( 'link-internal' )
          .text( headText )
          .attr( 'href', '#' + headText )
          .appendTo( li );
      } );
  }

  source = document.getElementsByTagName( 'html' )[ 0 ].innerHTML;
  // add support for md style links
  source = source.replace( /\[(.*?)]\((.*?)\)/g, ( match, p1, p2 ) => {
    return `<a href="${p2}">${p1}</a>`;
  } );
  // custom simple internal link format
  source = source.replace( /\[\[(.*?)]\]/g, ( match, p1 ) => {
    const found = source.indexOf( `#${p1}` );
    let result = "";
    if ( found < 0 ) {
      result = `<a class="link-internal broken-link" href="#${p1}">${p1}</a>`;
    } else {
      result = `<a class="link-internal" href="#${p1}">${p1}</a>`;
    }
    return result;
  } );

  // todo - make this more efficient (currently rewrites whole DOM)
  document.getElementsByTagName( 'html' )[ 0 ].innerHTML = source;
  $( 'pre code' )
    .each( function( i, block ) {
      hljs.highlightBlock( block );
    } );

  // add links to resources
  const res = $( "#resources" );
  $( "a" )
    .not( ".link-internal" )
    .each( ( index, el ) => {
      const ell = $( el );
      const link = ell.attr( 'href' );

      if ( !link ) {
        return;
      }

      const blacklist = [
            "localhost",
            "192.168.99.100",
            "coreyshuman",
            "geekwise",
            "slack"
        ];

      for ( let i = 0; i < blacklist.length; i++ ) {
        if ( link.indexOf( blacklist[ i ] ) >= 0 ) {
          return;
        }
      }

      const li = $( '<li/>' )
        .addClass( 'ui-list-0' )
        .appendTo( res );
      const a = $( '<a/>' )
        .addClass( 'ui-link' )
        .text( link )
        .attr( 'href', link )
        .appendTo( li );
    } );

  // make links open in new tab
  $( "a" )
    .not( ".link-internal" )
    .attr( "target", "_blank" );

  // utility stuff
  function replaceTag( tag ) {
    const tagsToReplace = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '`': '&#96'
    };
    return tagsToReplace[ tag ] || tag;
  }

  function safe_tags_replace( str ) {
    return str.replace( /[&<>]/g, replaceTag );
  }

  function normalize_indent( str ) {
    let i = 0;
    let parts = str.split( /\r?\n/ );
    if ( parts[ 0 ].trim() === '' ) {
      parts.splice( 0, 1 );
    }

    let baseCount = 0;
    for ( i = 0; i < parts.length; i++ ) {
      let j = 0;
      let part = parts[ i ];
      for ( j = 0;; j++ ) {
        if ( part[ j ] != ' ' )
          break;
      }
      if ( i == 0 ) {
        baseCount = j;
        parts[ i ] = part.substring( baseCount );
      } else if ( j >= baseCount ) {
        parts[ i ] = part.substring( baseCount );
      }
    }
    if ( parts[ i - 1 ].trim() === '' ) {
      parts.splice( i - 1, 1 );
    }
    return parts.join( '\n' );
  }
} );
