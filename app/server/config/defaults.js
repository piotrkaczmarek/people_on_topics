var url = require('url');
var redisURL = {};
var redisPassword;
if(process.env.REDISCLOUD_URL) {
  redisURL = url.parse(process.env.REDISCLOUD_URL);
  redisPassword = redisURL.auth.split(":")[1]
}

module.exports = {
  serverPort: process.env.PORT || 8080,
  socketIp:'http://localhost',
  elasticsearch: {
    ip: 'localhost',
    port: '9200'
  },
  redis: {
    ip: redisURL.hostname,
    port: redisURL.port,
    password: redisPassword
  }
}