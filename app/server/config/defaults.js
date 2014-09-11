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
  elasticsearchHost: process.env.BONSAI_URL || 'localhost:9200',
  redis: {
    host: redisURL.hostname,
    port: redisURL.port,
    password: redisPassword
  },
  tokenSecret: process.env.TOKEN_SECRET || 'development_fallback_secret'
}