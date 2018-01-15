const Discord = require('discord.js');
const bot = new Discord.Client();
const prefix = '!';

let enabled = false;

bot.on('message', (message) => {
    
    const lowMessage = message.content.toLowerCase();


    const corrections = {
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

    if(enabled){
        for(key in corrections){
            if(lowMessage.includes(key)){
                message.channel.sendMessage(
                    `*${corrections[key]}`
                );
            }
        }
    }


   
   
   if (!message.content.startsWith(prefix)) return;

   var args = message.content.substring(prefix.length).split(" ");

   switch (args[0].toLowerCase()) {
       case "help":
        message.channel.send("Here are all of the short-term words with the translations, Enjoy!")
        message.channel.sendEmbed(getHelp(corrections));
        message.channel.send("Also, to get the bot running do '!on' and if you want to close it do '!off' ")
        break;
       case "on":
        enabled = true;
        message.channel.send("Corrections are now being listened for...");
        break;
       case "off":
        enabled = false;
        message.channel.send("Corrections are now not being listened for.");
        break;


     

          
   }
   
});

bot.login('***');

function getHelp(corrections){
    let embed = new Discord.RichEmbed();
    embed.setColor([255,0,0]);

    for(key in corrections){
        embed.addField(key,corrections[key]);
    }

    return embed;
}

