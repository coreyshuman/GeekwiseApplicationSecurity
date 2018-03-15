module.exports = {
  ssl: {
    enabled: process.env.SSL_ENABLED === 'true',
    redirect: true, // Redirect non-SSL requests to SSL port.
    email: process.env.SSL_EMAIL, // Let's Encrypt contact email
    domains: process.env.SSL_DOMAINS.split( ',' ), // SSL Domain names
    prod: process.env.SSL_PROD === 'true', // if false, provisions (untrusted) SSL certs to avoid 5 certs/week/domain limit.
    plainPorts: [ 8080 ], // Map to 80
    tlsPorts: [ 8443, 8001 ], // Map to 443 and 5001
    certsDir: '/cert' // Docker to persist certs.
    // certsDir: require('os').homedir() + '/.ssl_certs' // Use if developing on OSX/Linux
  }
};
