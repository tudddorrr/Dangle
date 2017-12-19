require('dotenv').config();

var express = require('express');
const path = require('path');
var cors = require('cors');
var bodyParser = require('body-parser');
var low = require('lowdb');
var ImageResolver = require('image-resolver');
const uuid = require('uuid');
const isUrl = require('is-url');
var _ = require('lodash');
var randomColor = require('randomcolor');
var bot = require('./bot');
var app = express();

app.use(bodyParser.json());
app.set('view engine', 'pug');
app.use("/static", express.static(path.join(__dirname, "public")));

var whitelist = [
  'http://localhost:4200',
  'http://dangl.es'
];

var corsOptions = {
  origin: function (origin, callback) {
    var isWhitelisted = whitelist.indexOf(origin) !== -1;
    callback(null, isWhitelisted);
  },
  credentials: true
}
app.use(cors(corsOptions));


const port = 4040;
var server = app.listen(4040, "0.0.0.0", function () {
  console.log("Dangle server listening on port " + port);
});

// set defaults
var db = low('db.json');
db.defaults({ games: [], tags: [], events: [], issues: [] })
  .write();

// getting games
app.get('/games', function (req, res) {
  return res.json(db.get('games').value());
});

// getting a game
app.get('/game', function (req, res) {
  return res.json(db.get('games').find({id: req.query.id}));
});

// adding a game
app.post('/game', function (req, res) {
  if (!req.body.name || !req.body.link || !req.body.desc) {
    return res.json({ success: false, err: 'err_missing_details', msg: 'You haven\'t filled in all the required fields' })
  }

  if(!isUrl(req.body.link)) {
    return res.json({ success: false, err: 'err_link_invalid', msg: 'That download link isn\'t a valid URL' });
  }

  if(req.body.image && !isUrl(req.body.image)) {
    return res.json({ success: false, err: 'err_img_invalid', msg: 'That image link isn\'t a valid URL' });
  }

  // handle duplicates
  var duplicate = db.get('games')
    .find({ name: req.body.name, link: req.body.link });

  if (duplicate.value()) {
    return res.json({ success: false, err: 'err_duplicate', msg: 'This game already exists!' });
  }

  // add its tags to the database
  _.forEach(req.body.tags, function(tag) {
    if(_.indexOf(db.get('tags').value(), tag)===-1) {
      db.get('tags').push(tag).write();
    }
  });

  // assign it a uuid
  var id = uuid.v4();

  var communityLinks = [];
  _.forEach(req.body.communityLinks, function(community) {
    if(community.link.length>0) communityLinks.push(community);
  });

  var game = {
    id: id,
    name: req.body.name.toLowerCase(),
    link: req.body.link.toLowerCase(),
    image: req.body.image || 'assets/img/unknown.png',
    desc: req.body.desc,
    tags: req.body.tags,
    platforms: req.body.platforms,
    communityLinks: communityLinks,
    nsfw: req.body.nsfw
  }

  // add the game
  db.get('games')
    .push(game)
    .write();

  if (!req.body.image) {
    var resolver = new ImageResolver();
    resolver.register(new ImageResolver.FileExtension());
    resolver.register(new ImageResolver.MimeType());
    resolver.register(new ImageResolver.Opengraph());
    resolver.register(new ImageResolver.Webpage());

    resolver.resolve(req.body.link, function (result) {
      var image;

      if (result) {
        image = result.image;
        db.get('games')
          .find({ id: id })
          .assign({ image: image })
          .write();
      } else {
        console.log("No image found for " + req.body.link);
      }
    });
  }

  console.log("\nAdded new game: " + JSON.stringify(game));

  res.json({success: true, game: game});
});

// getting events
app.get('/events', function(req, res) {
  return res.json(db.get('events').filter({
    meta: {
      gameid: req.query.id
    }
  }));
});

// adding an event
app.post('/event', function(req, res) {
  if (!req.body.title || !req.body.start || !req.body.end) {
    return res.json({ success: false, err: 'err_missing_details', msg: 'You haven\'t filled in all the required fields' })
  }

  var colour = randomColor();
  var event = {
    title: req.body.title,
    start: req.body.start,
    end: req.body.end,
    color: {
      primary: colour,
      secondary: colour,
    },
    meta: req.body.meta
  };

  db.get('events')
    .push(event)
    .write();

  console.log("\nAdded new event: " + JSON.stringify(event));

  res.json({ success: true, event: event});
});

// getting tags
app.get('/tags', function(req, res) {
  return res.json(db.get('tags'));
});

// adding an issue
app.post('/issue', function(req, res) {
  if(!req.body.mode || !req.body.category || !req.body.desc || !req.body.gameid) {
    return res.json({ success: false, err: 'err_missing_details', msg: 'You haven\'t filled in all the required fields' })    
  }

  // assign it a uuid
  var id = uuid.v4();

  var issue = {
    id: id,
    mode: req.body.mode,
    category: req.body.category,
    desc: req.body.desc,
    gameid: req.body.gameid,
    status: 'Open',
    comment: ''
  }

  db.get('issues')
    .push(issue)
    .write();

  // post a twitter status about it
  bot.status(issue);

  res.json({ success: true });    
});

// getting an issue
app.get('/issue', function(req, res) {
  var issue = db.get('issues')
    .find({ id: req.query.id })
    .value();

  if(!issue) return res.status(404).send('That issue ID doesn\'t seem to exist');

  var game = db.get('games')
                   .find({id: issue.gameid})
                   .value();
  if(!game) return res.status(404).send('The game associated with this issue ID doesn\'t seem to exist');

  res.render('issue', { mode: issue.mode, name: game.name, gameid: issue.gameid, category: issue.category, desc: issue.desc, status: issue.status, comment: issue.comment });
});