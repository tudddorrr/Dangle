var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var low = require('lowdb');
var ImageResolver = require('image-resolver');
const uuid = require('uuid');
var app = express();

app.use(bodyParser.json());

var whitelist = [
  'http://localhost:4200',
];

var corsOptions = {
  origin: function(origin, callback){
        var isWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, isWhitelisted);
  },
  credentials: true
}
app.use(cors(corsOptions));

var server = app.listen(4040, "0.0.0.0", function () {
  var port = server.address().port;
  console.log("Dangle server listening on port " + port);
});

// set defaults
var db = low('db.json');
db.defaults({ games: [], tags: [], events: [] }) 
  .write();

// getting games
app.get('/games', function (req, res) {
  return res.json(db.get('games').value());
});

// adding a game
app.post('/games', function (req, res) {
  if(!req.body.name || !req.body.link) {
    return res.json({resp: false, err: 'err_missing_details', msg: 'You haven\'t filled in all the required fields'})
  }

  // handle duplicates
  var duplicate = db.get('games')
                    .find({name: req.body.name, link: req.body.link});

  if(duplicate.value()) {
    return res.json({resp: false, err: 'err_duplicate', msg: 'This game already exists!'});
  }

  // assign it a uuid
  var id = uuid.v4();

  // fallback image
  var fallback = 'https://unsplash.it/1280/720?image=' + (10 + Math.floor(Math.random()*100));

  var game = {
    uuid: id,
    name: req.body.name,
    image: fallback,
    link: req.body.link,
    desc: req.body.desc,
    platforms: req.body.platforms,
    tags: req.body.tags
  }

  // add the game
  db.get('games')
    .push(game)
    .write();

  // add its tags
  
  var resolver = new ImageResolver();
  resolver.register(new ImageResolver.FileExtension());
  resolver.register(new ImageResolver.MimeType());
  resolver.register(new ImageResolver.Opengraph());
  resolver.register(new ImageResolver.Webpage());

  resolver.resolve(req.body.link, function (result) {
      if(result) {
        db.get('games')
          .find({uuid: uuid})
          .assign({image: result.image})
          .write();
      } else {
        console.log("No image found for " + req.body.link);
      }
  });

  console.log("Added new game: " + JSON.stringify(req.body));

  res.json(game);
});