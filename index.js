const Discord = require('discord.js');
const Enmap = require('enmap');
const EnmapLevel = require('enmap-level');
const configuration = require('./config/config.json');
//get client (dummy for bot)
const bot = new Discord.Client();
const prefix = '!';

let enabled = false;

//setup database
const tableSource = new EnmapLevel({name: "corrections", persistent: true});
const corrections = new Enmap({provider: tableSource});


//store defaults
const correctionsDefaults = {
    "bc": "because",
    "idk":"I don't know",
    "idc": "I don't care",
    "imo": "In my opinion",
    "aka": "Also known as",
    "afk": "Away from keyboard",
    "brb": "Be right back!",
    "gtg": "Got to go!",
    "4": "for",
    "m8": "Mate",
    "cya": "See you later!",
    "ez": "easy"
};

if(corrections.get("words")!=undefined){
    let current = corrections.get("words");
    Object.assign(current,correctionsDefaults);
    corrections.set("words",current);
}
else {
    corrections.set("words",correctionsDefaults);
}

//on-memory words map
let memWords = corrections.get("words");

bot.on('message', (message) => {
    
    const lowMessage = message.content.toLowerCase();

    if(enabled && message.author.id!=bot.user.id){
        for(key in memWords){
            console.log(key);
            if(lowMessage.includes(key)){
                message.channel.sendMessage(
                    `*${memWords[key]}`
                );
            }
        }
    }


   
   
   if (!message.content.startsWith(prefix)) return;

   var args = message.content.substring(prefix.length).split(" ");
   
   const msgChann = message.channel;
   switch (args[0].toLowerCase()) {
       case "add":
        //make sure user has enough arguments
        if(args.length>=3){
            const shortForm = args[1];
            const realWord = args[2];
            memWords[shortForm] = realWord;
            save();
        }
        else{
            msgChann.sendMessage("incorrect usage");
        }
        break;
       case "help":
        msgChann.send("Here are all of the short-term words with the translations, Enjoy!")
        msgChann.send(getHelp(corrections.get("words")));
        msgChann.send("Also, to get the bot running do '!on' and if you want to close it do '!off' ")
        msgChann.send("You can add words with !add (word) (correction)")
        break;
       case "on":
        enabled = true;
        msgChann.send("Corrections are now being listened for...");
        break;
       case "off":
        enabled = false;
        msgChann.send("Corrections are now not being listened for.");
        break;


     

          
   }
   
});

bot.login(configuration.password);

function getHelp(corrections){
    let embed = new Discord.RichEmbed();
    embed.setColor([255,0,0]);

    for(key in corrections){
        embed.addField(key,corrections[key]);
    }

    return embed;
}

function save(){
    corrections.set("words",memWords);
}

