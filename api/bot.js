var Twit = require('twit');

var T = new Twit({
  consumer_key: process.env.T_CONSUMER_KEY,
  consumer_secret: process.env.T_CONSUMER_SECRET,
  access_token: process.env.T_ACCESS_TOKEN,
  access_token_secret: process.env.T_ACCESS_TOKEN_SECRET,
  timeout_ms: 60000
});

exports.status = function(issue) {
  T.post('statuses/update', { status: "@sekaru_ There's a new Dangle report! http://dangl.es/i/index.html?id=" + issue.id}, function(err, data, response) {
    console.log('Posted a status for Issue ID ' + issue.id);
  });
} 