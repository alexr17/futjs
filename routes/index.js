var express = require('express');
var router = express.Router();
const Player = require('../knex/player.js');
const fs = require('fs')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/player', function(req, res, next) {
  Player.get_obj('players', 'id', 33).then(player => {
    player.get_html().finally(_=> {
      res.render('player', { title: 'Player view', player: player});
    })
  }).catch(err => {
    console.log(err);
  })
  
})
module.exports = router;
