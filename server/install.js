var service = require('node-windows').Service;

var svc = new service({
    name:'Web分屏服务',
    description:'JT web splitview services',
    script: 'server.js'
});

svc.on('install',function(){
    svc.start();
});

svc.install();