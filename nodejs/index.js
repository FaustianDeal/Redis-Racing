require('dotenv').config();
var bodyParser = require('body-parser');
const 
  rejson = require('redis-rejson');
  redis = require('redis');
  // json = require('json')
  express = require('express')
  app = express();
  port = 3000

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

rejson(redis);

let
  client    = redis.createClient({
    port      : 6379,               // replace with your port
    host      : '192.168.1.158',    // replace with your hostanme or IP address
  });

require('./updatepos.js')(app,client);
require('./updatelaptime.js')(app,client);
require('./getleaderboard.js')(app, client);
require('./login.js')(app,client);

client.json_set("players", ".", "{}", function(err, res) {
  if (err) throw err;
  console.log("Initialized players key");
});

client.keys('*', function(err, keys) {
  if (!keys.includes("players")){
    console.log("Initialized players key")
    client.json_set("players", ".", "{}")
  }
  if (!keys.includes("leaderboard")){
    console.log("Initialized leaderboard key")
    client.json_set("leaderboard", ".", "{}")
  }
})

function autoremoveplayer(){
  client.json_get("players", function (err, results) {
    const playerdata = Object.values(JSON.parse(results))
    playerdata.forEach(function (item, index) {
      var namepath = `._${item.name}`
      var seconds = Math.floor((new Date() - Date.parse(item.lastping)) / 1000);
      if (seconds > 30) {
        client.json_del('players', namepath)
        client.json_del('leaderboard', namepath)
        console.log(`Removed ${item.name}`)
      }
    });
  })
}

autoremoveplayer();

setInterval(function(){
  autoremoveplayer()
}, 15000)

app.listen(port, "0.0.0.0", () => {
  console.log(`Example app listening at http://localhost:${port}`)
}) 
