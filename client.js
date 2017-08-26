/*
Created by Ethan D (AKA FuturisticCake)
© 2015, All Rights Reserved
Do not distribute without permission from software author.
*/

var name = "Micro.Client";

console.log("Micro.Client\nCreated by Ethan D (FuturisticCake)\nAll rights reserved, © 2015\nDo not distribute this software without permission from its author. ;)");

var fs = require("fs");

try {
    var a = require("mineflayer");
}
catch (err) {
    console.log("["+name+"] Cannot load package: mineflayer");
    console.log("["+name+"] To install Mineflayer, type 'npm install mineflayer'. Mineflayer is from a 3rd party source, so Ethan D cannot be held responsible for any harm caused by the Mineflayer package.");
    console.log("["+name+"] Stopping client...")
    process.exit(1);
}

function log(pre, msg) {
  console.log("["+pre+"] "+msg);
  return;
}

process.on("uncaughtException", function(err) {
  console.log("Caught error. "+err);
});

// Generating / parsing config...

var defaultConfig = {
    "address": "localhost",
    "port": 25565
};

try {
    fs.readFileSync(__dirname+"/config.json");
}
catch (err) {
    console.log("No config found. Generating...");
    fs.writeFileSync(__dirname+"/config.json", JSON.stringify(defaultConfig));
}

var config = JSON.parse(fs.readFileSync(__dirname+"/config.json"));

console.log("Read config.");
console.log("Config: "+JSON.stringify(config));

var server = config.address;
var names = ["123","99","SkillAura","Bro","Ninja","12","__","_","Mega","Uber","Super","Bro","Sick","Miner","PvP","xX","Xx","Power","Bob","Billy","Joe", "Power", "Archer", "5", "Ranger", "Duck", "NoHax", "Haxor", "JustSkill", "donald", "ray", "maria", "fire", "PvP", "pvp", "ping", "YT", "Live", "Doom", "Or", "Ore", "Dog", "Wolf", "Cat"];
var port = config.port;

var bots = [];
var usernames = [];

var ct_list = ["sprint", "forward", "back", "jump", "left", "right"];

var derp = false;
var bcspamtext = [];
var ka = false;
var ka_follow = false;
var ka_tp = false;
var ka_target;
var chaton = true;

setInterval(function() {
  if (derp === true) {
    for (var i = 0; i < usernames.length; i++) {
      try {
        if (typeof bots[i].setControlState == "function" && typeof bots[i].look == "function") {
          if (Math.floor(Math.random() * 2) == 1) {
            bots[i].clearControlStates();
          }
          bots[i].look(Math.floor(Math.random() * 5), Math.floor(Math.random() * 2) - 1);
          var ct_temp = Math.floor(Math.random() * 5);
          if (Math.floor(Math.random() * 2) == 1) {
            var ct_state = false;
          }
          else {
            var ct_state = true;
          }
          bots[i].setControlState(ct_list[ct_temp], ct_state);
        }
      }
      catch (err) {

      }
    }
  }
}, 2000);

function arrayHas(arr, search) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] === search) {
            return true;
        }
    }
    return false;
}

function joinbot(uname, prt) {
    var tempname = "";
    for (var i = 0; i < Math.floor(Math.random()*3) + 2; i++) {
      if (Math.floor(Math.random() * 2) == 1) {
        tempname += names[Math.floor(Math.random()*names.length)].toLowerCase();
      }
      else {
        tempname += names[Math.floor(Math.random()*names.length)];
      }
     }
     if (uname != null || uname != undefined || uname === "resetME") {
      tempname = uname;
     }
     if (tempname.length > 16) {
      console.log("Username too long. Regenerating...");
        for (var i = 0; i < Math.floor(Math.random()*3) + 1; i++) {
             tempname += names[Math.floor(Math.random()*names.length)];
         }
     }
     tempname = tempname.replace("\n", "").replace("\r", "");
     usernames.push(tempname);
     console.log("Bot username has been determined. "+tempname+", ID:"+usernames.length);
     if (!prt) {
     bots.push(a.createBot({
             "host": server,
              "port": port,
               "username": tempname
    }).on("spawn", function() {
           console.log("Clone bot spawned: "+tempname+", ID: "+usernames.length);
    }).on("chat", function(user, msg) {
      if (chaton === true) {
        console.log(tempname+" heard: "+user+": "+msg);
      }
     }).on("whisper", function(user, msg) {
        console.log(tempname+" was whispered: "+user+": "+msg);
     }).on("message", function(msg) {
        console.log(tempname+" was messaged: "+msg);
     }).on("kicked", function(msg) {
      console.log(tempname+" was kicked: "+msg);
     }));
     console.log("Created bot: '"+tempname+"'");
   }
   else {
    bots.push(a.createBot({
             "host": server,
              "port": prt,
               "username": tempname
    }).on("spawn", function() {
           console.log("Clone bot spawned: "+tempname+", ID: "+usernames.length+", PORT: "+prt);
    }).on("chat", function(user, msg) {
      if (chaton === true) {
        console.log(tempname+" heard: "+user+": "+msg);
      }
     }).on("whisper", function(user, msg) {
        console.log(tempname+" was whispered: "+user+": "+msg);
     }).on("message", function(msg) {
        console.log(tempname+" was messaged: "+msg);
     }).on("kicked", function(msg) {
      console.log(tempname+" was kicked: "+msg);
     }));
    log("JP", "Created bot: "+tempname+". Sent to port: "+prt);
   }
}

var ka_last = false;

function nearestPlayer(k) {
  var bestDistance = null;
    var best = null;
    var id, entity, dist;
    for (id in bots[k].entities) {
      entity = bots[k].entities[id];
      dist = bots[k].entity.position.distanceTo(entity.position);
      if (entity.type === "player" && entity != bots[k].entity) {
        if (!best || dist < bestDistance) {
          best = entity;
          bestDistance = dist;
        }
      }
    }
    return best;
}

setInterval(function() {
  if (ka == true) {
    for (var i = 0; i < bots.length; i++) {
      var kb_target = nearestPlayer(i);
      if (!kb_target) return;
      if (ka_follow) {
        bots[i].lookAt(kb_target.position.offset(0, kb_target.height, 0));
        bots[i].setControlState("sprint", true);
        bots[i].setControlState("forward", true);
        bots[i].setControlState("jump", true);
      }
      if (ka_tp) {
        bots[i].entity.position.y = kb_target.position.y;
        bots[i].entity.position.z = kb_target.position.z;
        bots[i].entity.position.x = kb_target.position.x;
      }
      bots[i].attack(kb_target, true);
    }
  }
}, 100);

var ps_ports = [];

function scanfrom(p, p2) {
  ps_ports.push(p);
  var ps = require("portscanner");
  ps.findAPortInUse(p, p2, config.address, function(error, port) {
    if (error) {
      log("PS", "Port scan complete.");
    }
    else {
      log("PS", "Found an open port: "+port);
      scanfrom(port + 1, p2);
    }
  });
}

process.stdin.resume();
process.stdin.setEncoding("utf8");
process.stdin.on("data", function(txt) {
  var text = txt.replace("\n", "").replace("\r", "");
        if (text.indexOf(".") == 0) {
                if (text.indexOf("list") == 1) {
                        console.log("Player listing... Importing from bot ID 0.");
                        console.log(JSON.stringify(bots[0].players));
                }
                if (text.indexOf("stat") == 1) {
                  var plyr = text.split("stat ")[1];
                  if (bots[0].players.hasOwnProperty(plyr)) {
                  }
                  else {
                    console.log("That player is not online.");
                    return;
                  }
                  console.log("---- Player Stats: "+plyr+" -----");
                  console.log("Name: "+bots[0].players[plyr].username);
                  console.log("UUID: "+bots[0].players[plyr].uuid);
                  console.log("-- Entity data --");
                  console.log("Location: "+bots[0].players[plyr].entity.position.x+" "+bots[0].players[plyr].entity.position.y+" "+bots[0].players[plyr].entity.position.z);
                  console.log("Velocity: "+bots[0].players[plyr].entity.velocity.x+" "+bots[0].players[plyr].entity.velocity.y+" "+bots[0].players[plyr].entity.velocity.z);
                  console.log("On Ground: "+bots[0].players[plyr].entity.onGround);
                  console.log("Height: "+bots[0].players[plyr].entity.height);
                  console.log("Effects: "+JSON.stringify(bots[0].players[plyr].entity.effects));
                  try {
                    console.log("Held item: Item Name:"+bots[0].players[plyr].entity.heldItem.name+ " Name: "+ bots[0].players[plyr].entity.heldItem.name + " Count: "+bots[0].players[plyr].entity.heldItem.count);
                  }
                  catch (err) {
                    console.log("Held item: None");
                  }
                  console.log("------- End of Micro.Client player stats -------");
                }
                if (text.indexOf("tp") == 1) {
                  console.log("Force-Teleporting from "+bots[0].entity.position.x+" "+bots[0].entity.position.y+" "+bots[0].entity.position.z);
                        var ap = text.split(" ");
                        for (var i = 1; i < ap.length; i++) {
                          if (ap[i].indexOf("~") != -1) {
                            ap[i] = ap[i].replace("~", "");
                            if (i == 1) {
                              ap[i] = bots[0].entity.position.x + Number(ap[i]);
                            }
                            if (i == 2) {
                              ap[i] = bots[0].entity.position.y + Number(ap[i]);
                            }
                            if (i == 3) {
                              ap[i] = bots[0].entity.position.z + Number(ap[i]);
                            }
                          }
                        }
                        bots[0].entity.position.x = Number(ap[1]);
                        bots[0].entity.position.y = Number(ap[2]);
                        bots[0].entity.position.z = Number(ap[3]);
                        console.log("Force-teleport complete. Now at "+bots[0].entity.position.x+" "+bots[0].entity.position.y+" "+bots[0].entity.position.z);
                }
                if (text.indexOf("ka") == 1) {
                  if (text.split("ka")[1].length < 2) {
                    if (ka == true) {
                      console.log("Killaura is now off.");
                      ka = false;
                    } else {
                      console.log("Killaura is now on.");
                      ka = true;
                    }
                  }
                  else {
                    if (text.split("ka ")[1] == "follow") {
                      if (ka_follow == true) {ka_follow = false;console.log("KA Follow: Off");} else {ka_follow = true; console.log("KA Follow: On");}
                    }
                    if (text.split("ka ")[1] == "tp") {
                      if (ka_tp == true) {ka_tp = false;console.log("KA TP: Off");} else {ka_tp = true; console.log("KA TP: On");}
                    }
                  }
                }
                if (text.indexOf("a ") == 1) {
                    var act = text.toString().replace("\n","").split(" ")[1];
                    if (act != "jump" && act != "forward" && act != "back" && act != "left" && act != "right" && act != "sprint") {
                        console.log("\n------\nInvalid acton! Bot actions list:\nforward\nback\njump\nleft\nright\nsprint\n------\n");
                        return;
                    }
                    if (text.toString().replace("\n","").split(" ")[2] == "false" || text.toString().replace("\n","").split(" ")[2] == "no" || text.toString().replace("\n","").split(" ")[2] == "n" || text.toString().replace("\n","").split(" ")[2] == "f") {
                        var actionbool = false;
                    }
                    else {
                        var actionbool = true;
                    }
                    for (var i = 0; i < usernames.length; i++) {
                         bots[i].setControlState(text.toString().replace("\n","").split(" ")[1], actionbool);
                         console.log(usernames[i]+ ": Action '"+text.toString().replace("\n","").split(" ")[1]+" value set to "+text.toString().replace("\n","").split(" ")[2]);
                    }
                }
                if (text.indexOf("tchat") == 1) {
                  if (chaton == true) {
                    chaton = false;
                    console.log("Chat listening disabled.");
                  }
                  else {
                    chaton = true;
                    console.log("Chat listening enabled.");
                  }
                }
                if (text.indexOf("derp") == 1) {
                  if (derp == true) {
                    derp = false;
                    console.log("Derp mode disabled.");
                  }
                  else {
                    derp = true;
                    console.log("Derp mode enabled.");
                  }
                }
                if (text.indexOf("bspam ") == 1) {
                	for (var i = 0; i < Number(text.split("bspam ")[1]); i++) {
                		joinbot();
                	}
                    return;
                }
                if (text.indexOf("ps ") == 1) {
                  ps_ports = [];
                  var ps_ = text.split(" ");
                  try {
                    var ps = require("portscanner");
                  }
                  catch (err) {
                    console.log("Could not load portscanner module. To install, type 'npm install portscanner'. Portscanner is from a 3rd party source, so Ethan D cannot be held responsible for any harm caused by the 'portscanner' package.");
                    return;
                  }
                  log("PS", "Port range: "+ps_[1]+" - "+ps_[2]);
                  log("PS", "Scanning...");
                  ps.findAPortInUse(ps_[1], ps_[2], config.address, function(error, port) {
                   if (error) {
                    log("PS", "Port san complete!");
                  }
                   else {
                    log("PS", "Found open port: "+port);
                    scanfrom(port);
                    }
                   });
                  return;
                }
                if (text.indexOf("jp") == 1) {
                  log("JP", "Joining bots to scanned ports...");
                  for (var i = 0; i < ps_ports.length; i++) {
                    joinbot("resetME", ps_ports[i]);
                  }
                  log("JP", "Bot variables have been created.");
                }
                if (text.indexOf("bnspam ") == 1) {
                  console.log("Spamming bot joining with custom name... "+text.replace("\n", "").split(" ")[2]);
                  for (var i = 0; i < Number(text.split("bnspam ")[1].split(" ")[0]); i++) {
                    console.log("Joining "+text.replace("\n", "").split(" ")[2]+i+"...");
                    joinbot(text.replace("\n", "").split(" ")[2]+i);
                  }
                    return;
                }
                if (text.indexOf("bcspam ") == 1) {
                  if (text.split("bcspam ")[1].replace("\n", "") == "off") {
                    bcspamtext = [];
                    console.log("Disabled bot spamming for ALL bots.");
                    return;
                  }
                  bcspamtext.push(text.split("bcspam ")[1]);
                  console.log("Added bot spamming variable for ALL bots.");
                }
                if (text.indexOf("serverspam ") == 1) {
                  if (text.split("serverspam ")[1].replace("\n", "") == "off") {
                    bcspamtext = [];
                    console.log("Disabled bot spamming for ALL bots.");
                    return;
                  }
                  bcspamtext.push("<3 "+text.split("serverspam ")[1].toLowerCase()+" <3 that server");
                  bcspamtext.push("Best server EVER! "+text.split("serverspam ")[1].toLowerCase());
                  bcspamtext.push("Join "+text.split("serverspam ")[1]);
                  bcspamtext.push("I <3 "+text.split("serverspam ")[1]+ "!");
                  bcspamtext.push("guys you need to go to the server "+text.split("serverspam ")[1].toLowerCase()+ " its really sick");
                  bcspamtext.push("sick server "+text.split("serverspam ")[1].toLowerCase()+ " :P");
                  bcspamtext.push("The server "+text.split("serverspam ")[1].toLowerCase()+ " is so fun :D");
                  bcspamtext.push("i like this server "+text.split("serverspam ")[1].toLowerCase()+ "");
                  bcspamtext.push("super fun server at "+text.split("serverspam ")[1].toLowerCase()+ ". really nice maps");
                  bcspamtext.push("epic server at "+text.split("serverspam ")[1].toLowerCase()+ " i played on it and its neat");
                  bcspamtext.push("look at "+text.split("serverspam ")[1].toLowerCase()+ " its really cool");
                  bcspamtext.push("dude check out "+text.split("serverspam ")[1].toLowerCase()+ "");
                  bcspamtext.push(text.split("serverspam ")[1].toLowerCase()+ " is an amazing server");
                  bcspamtext.push(text.split("serverspam ")[1].toLowerCase()+" <<< Sick server!");
                  console.log("Added bot server spamming variable for ALL bots.");
                }
                if (text.indexOf("jbot") == 1) {
                    console.log("Joining bot...");
                  if (text.toString().replace("\n","").split("jbot")[1].length > 1) {
                    joinbot(text.toString().replace("\n","").split("jbot ")[1]);
                  }
                  else {
                    joinbot();
                  }
                }
                if (text.indexOf("ph ") == 1) {
                  if (text.indexOf("list") != -1) {
                    console.log("Logging physics properties of bot Id 0...");
                    console.log(bots[0].physics);
                    return;
                  }
                  console.log("For a list of physics properties, do .ph list");
                  for (var i = 0; i < usernames.length; i++) {
                    bots[i].physics[text.split("ph ")[1].split(" ")[0]] = text.split(" ")[2];
                  }
                  console.log("Set physics '"+text.split("ph ")[1].split(" ")[0]+"' variable to '"+text.split(" ")[2]+"'.");
                }
                if (text.indexOf("export") == 1) {
                        console.log("Exporting in 5 seconds...");
                        var exp_id = Math.floor(Math.random() * 100000);
                        setTimeout(function() {
                            var exp = "Bots export (ID "+exp_id+")";
                            for (var i = 0; i < usernames.length; i++) {
                                exp = exp + "\n\n\n---- "+usernames[i]+" ----\n"+bots[i].toString();
                            }
                            fs.writeFileSync(__dirname+"/export"+exp_id+".log", exp);
                            console.log("Exported bots to /export"+exp_id+".log");
                        }, 5000);
                }
                if (text.indexOf("help") == 1) {
                    console.log("---- "+name+" Help ----\nTo chat as all bots, type directly into console.\n\nCommands:\n.help: Access this menu\n.export: Export all bot data\n.list: List all players on server\n.bchat <id> <message>: Chat as a bot based on bot ID. (Set ID to a for all bots.)\n.bspam <number of bots>: Join a number of bots with randomly generated names\n.jbot [name]: Joins a bot to the server with specified name. If no name is given, one will be generated.\n.a <action> [value boolean]: Sets all bots' control states. Default value is true.");
                }
        }
        else {
            for (var i = 0; i < usernames.length; i++) {
              bots[i].chat(text.toString().replace("\n",""));
           }
        }
});

setInterval(function() {
  if (bcspamtext.length != 0) {
    var sprandom = Math.floor(Math.random() * usernames.length);
    try {
      if (typeof bots[sprandom].chat == "function") {
         bots[sprandom].chat(bcspamtext[Math.floor(Math.random() * bcspamtext.length)]);
      }
    }
    catch (err) {

    }
  }
}, 200);

console.log("Everything has been set up! Ready for commands.");