var avahi = require('./index');

console.log('supported: ' + avahi.isSupported());

avahi.publish({ name: 'steward', type: '_http._tcp', port: 80 });
