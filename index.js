const Discord = require('discord.js');
const {Intents, Client} = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed, Permissions } = require('discord.js');
const fs = require('fs');
const sleep = require('sleep-promise');
//const { SlashCommandBuilder } = require('@discordjs/builders');



const client = new Client({ intents: [
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_MESSAGE_TYPING,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_INVITES,
        Intents.FLAGS.GUILD_VOICE_STATES]});

require('dotenv').config();

const g = require('./src/giveaway.json');



const prefix = process.env.PREFIX;



client.commands = new Discord.Collection();
client.events = new Discord.Collection();
client.sets = new Discord.Collection();
client.slash = new Discord.Collection();



const commandFiles = fs.readdirSync('./src/commands/').filter(file => file.endsWith('.js'));
const eventFiles = fs.readdirSync('./src/events/').filter(file => file.endsWith('.js'));
const setFiles = fs.readdirSync('./src/sets/').filter(file => file.endsWith('.js'));
const slashFiles = fs.readdirSync('./src/slash/').filter(file => file.endsWith('.js'));
for(const file of commandFiles){
    const command = require(`./src/commands/${file}`);
    client.commands.set(command.name, command);
}


for(const file of eventFiles){
    const event = require(`./src/events/${file}`);

    client.events.set(event.name, event);
}

for(const file of setFiles){
    const sets = require(`./src/sets/${file}`);

    client.sets.set(sets.name, sets);
}


for(const file of slashFiles){
    const command = require(`./src/slash/${file}`);
    client.slash.set(command.data.name, command);
}


client.once('ready', async () => {
    console.log(`==========================================`);
    console.log(`Eingeloggt als ${client.user.tag} auf ${client.guilds.cache.size} Servern.`);
    console.log(`==========================================`);
    client.user.setActivity({"name": "STOP THE WAR!", "type": "PLAYING"});
    //await client.events.get("tuningtreffen").execute(client);
});



client.on("guildCreate", async (guild) => {
    await client.events.get("guildCreate").execute(client, guild, true);
});



//removed from a server
client.on("guildDelete", async (guild) => {
    console.log("Left a guild: " + guild.name);
    //remove from guildArray
});




client.on("guildMemberAdd", async (member) => {
    await client.events.get("guildCreate").execute(client, member.guild, false);
    //await sleep(500);
    //client.events.get("guildMemberAdd").execute(client, member, true);
});



//Command Listen Anfang

const kick = ["KICK", "Kick", "kick"];

const ban = ["BAN", "Ban", "ban"];

const clear = ["CLEAR", "Clear", "clear"];

const help = ["HELP", "Help", "help"];

const info = ["INFO", "Info", "info", "INFOS", "Infos", "infos"];

const ping = ["PING", "Ping", "ping"];

const serverinfo = ["SERVERINFO", "Serverinfo", "serverinfo"];

const boost = ["BOOST", "Boost", "boost"];

const xp = ["rank"];

const set = ["SET", "Set", "set"];

const purge = ["PURGE", "Purge", "purge"];

const quiz = ["QUIZ", "Quiz", "quiz"];

const lb = ["LB", "Lb", "lb"];

const bug = ["BUG", "Bug", "bug"];

const bugans = ["BUGANS", "Bugans", "bugans"];

const alert = ["ALERT", "Alert", "alert"];

const globalbann = ["GB", "Gb", "gb"];

const ttadmin = ["ttadmin"];

const addxp = ["ADD-XP", "add-xp"];

const removexp = ["REMOVE-XP", "remove-xp"];

const warn = ["Warn", "warn", "WARN"];

//Command Listen Ende



client.on('interactionCreate', async (interaction) => {

    await client.events.get("guildCreate").execute(client, interaction.member.guild, false);
    await sleep(200);

    await client.events.get("guildMemberAdd").execute(client, interaction.member, false);
    await sleep(200);

    await client.commands.get("ranking").execute(client, interaction);
    await sleep(200);

    if (interaction.isCommand()) {

        let command = client.slash.get(interaction.commandName);

        if (command) {
            await command.execute(client, interaction);
        }


        //if (interaction.commandName === "ping") {
        //    await client.slash.get(interaction.commandName).execute(interaction);
        //}

        //if (interaction.commandName === "kick") {
        //    await client.slash.get(interaction.commandName).execute(client, interaction);
        //}
    }


    if (interaction.isButton()) {
        await client.events.get("interactionCreateButton").execute(client, interaction);


        if(interaction.customId === 'primary'){
            const filter = m => m.author.id === interaction.user.id
            const collector = interaction.channel.createMessageCollector({
                filter,
                max: 1,
                time: 30000,
                error: 'time'
            });

            interaction.reply({content: "Bitte gebe die `Channel-Id` des Kanals an, in den die Nachrichten gesendet werden sollen. Wenn du keinen eigenen Kanal dafür möchtest, schreibe `None`"})
            collector.on('collect', m => {});
            collector.on('end', collected => {
                collected.forEach((value) => {
                    const msgcontent = value.content
                    if(msgcontent.startsWith === "1" || "2" || "3" || "4" || "5" || "6" || "7" || "8" || "9" || "0"){
                        const embed = new MessageEmbed()
                            .setColor('#0099ff')
                            .setTitle('Mod Channels')
                            .setDescription(`Sie haben <#${msgcontent}> als Kanal für die Moderationsnachrichten angegeben`)
                            .setTimestamp()

                        interaction.followUp({ephemeral: true, embeds: [embed]})
                    }
                    let text = {"channel": msgcontent}
                    const obj = JSON.stringify(text);
                    if(fs.existsSync(`./src/${interaction.guild.id}/`)){
                        fs.writeFile(`./src/${interaction.guild.id}/modch.json`, obj, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                        console.log('saved')
                    }else{
                        fs.mkdir(`./src/${interaction.guild.id}`, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                        fs.writeFile(`./src/${interaction.guild.id}/modch.json`, obj, (err) => {
                            if (err) {
                                console.log(err);
                            }
                        })
                        console.log('saved')
                    }
                });
            });
        }
    }
});



client.on("modalSubmit", async (modal) => {

});





client.on('messageCreate', async message => {

    if (message.author.bot) return;
    //console.log(message.guild.members);

    await client.events.get("guildCreate").execute(client, message.member.guild, false);
    await sleep(200);

    await client.events.get("guildMemberAdd").execute(client, message.member, false);
    await sleep(200);

    var r = client.commands.get("automod").execute(client, message);
    if (r === 1) {
        return;
    }

    await client.commands.get("leveling").execute(client, message);
    await sleep(200);

    await client.commands.get("ranking").execute(client, message);
    await sleep(200);
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLowerCase();


    if (kick.includes(command) && command != null) {
        await client.commands.get('kick').execute(client, message, args);
    } if (ban.includes(command) && command != null) {
        await client.commands.get('ban').execute(client, message, args);
    } if (warn.includes(command) && command != null) {
        await client.commands.get('warn').execute(client, message, args);
    } if (purge.includes(command) && command != null) {
        await client.commands.get('clear').execute(message, args);
    } if (set.includes(command) && command != null){
        await client.commands.get(`set`).execute(client, message);
    } if(quiz.includes(command) && command != null){
        await client.commands.get(`quiz`).execute(message, args);
    } if (ping.includes(command) && command != null) {
        await client.commands.get("ping").execute(client, message, args);
    } if (help.includes(command) && command != null) {
        await client.commands.get("help").execute(message, null);
    } if (info.includes(command) && command != null) {
        await client.commands.get("info").execute(client, message);
    } if (serverinfo.includes(command) && command != null) {
        await client.commands.get("sv").execute(client, message, args);
    } if (boost.includes(command) && command != null) {
        await client.commands.get("boost").execute(client, message, args);
    } if (xp.includes(command) && command != null) {
        await client.commands.get("rank").execute(client, message, args);
    } if (bug.includes(command) && command != null) {
        await client.commands.get("bug").execute(client, message, args);
    } if (lb.includes(command) && command != null) {
        await client.commands.get("lb").execute(client, message);
    } if (bugans.includes(command) && command != null) {
        await client.commands.get("bugans").execute(client, message, args);
    } if (alert.includes(command) && command != null) {
        var server = args[0];
        args.shift()
        await client.commands.get("alert").execute(client, message, server, args);
    } if (addxp.includes(command) && command != null) {
        await client.commands.get("add-xp").execute(client, message, args);
    } if (removexp.includes(command) && command != null) {
        await client.commands.get("remove-xp").execute(client, message, args);
    } if (globalbann.includes(command) && command != null) {
        var user = args[0];
        args.shift()
        await client.commands.get("globalbann").execute(client, message, user, args);
    } if (command === "admin" && command != null) {
        console.log("Admin");
        await client.events.get("guildCreate").execute(client, message.member.guild, false);
        await sleep(500);
        await client.events.get("guildMemberAdd").execute(client, message.member, true);
    }

});



client.login(process.env.Discord_Bot_Token);