var bindings  = require('bindings')('avahi_pub.node')
  ,  interval = null;

module.exports =
{ publish     : function(opts) {
                  var service;

                  if (!module.exports.isSupported()) throw new Error('avahi_pub not supported on this platform');

                  service = bindings.publish(opts);
                  bindings.poll();
                  return service;
                }

, isSupported : function() {
                  return (require('os').platform() === 'linux');
                }

, kill        : function() {
                  clearInterval(interval);
                  interval = null;
                }
};

bindings.init();

if (module.exports.isSupported()) interval = setInterval(bindings.poll, 1000);
