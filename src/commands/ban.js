const { MessageEmbed, Permissions } = require("discord.js");
const fs = require("fs");
const sleep = require("sleep-promise");

module.exports = {
    name: 'ban',
    description: 'Dieser Command bannt einen Member!',
    async execute(client, message, args) {

        try {
            if (!message.member.permissions.has(Permissions.FLAGS.BAN_MEMBERS)) return client.commands.get("permission_error").execute(client, message);

            var member;
            if (args.length === 0) {
                return message.reply("Please enter a user!");
            }
             else {
                try {
                    //Versucht die User ID zu bekommen und zu User umzuwandeln
                    member = args[0].split("<@").join("").split(">").join("");
                    member = client.users.cache.find(user => user.id === member);

                    if (member === undefined) {
                        return message.reply("Please enter a valid user!");
                    }
                }

                catch (error) {
                    //Sonst ist Member = Message Author
                    return message.reply("An error has occurred. Please try again and enter a valid user. If the problem persists, please contact us via `#bug [bug]` and specify the bug.");
                }
            }


            if (member) {
                args.splice(args[1], 1);
                console.log(args)
                if (args.length === 0) {
                    return message.reply("A reason must be given!")
                }
                try {
                    const exampleEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle(`You were banned from the ${message.guild.name.toString()} Guild`)
                        .setDescription(`By ${message.author.username}#${message.author.discriminator}`)
                        .addFields({name: 'Reason:', value: `${args.join(" ")}`})
                        .setTimestamp()
                    await member.send({ embeds: [exampleEmbed] });
                } catch (err) {
                    message.reply("The user could not be informed about the ban.");
                }
                //message.guild.members.ban(member, {reason: args.join(" ")});
                const exampleEmbed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle('Moderation')
                    .setDescription(`${member.username}#${member.discriminator} was banned by <@${message.member.id}>.`)
                    .addFields({name: 'Reason:', value: `${args.join(" ")}`})
                    .setTimestamp()

                message.reply({ embeds: [exampleEmbed] });

                fs.readFile(`Server/${message.member.guild.id.toString()}.json`, "utf8", async function (err,data) {
                    if (err) {
                        console.log(err);
                    }

                    await client.events.get("guildMemberAdd").execute(client, member, false, message.guild.id.toString());
                    await sleep(200);

                    var json_data = JSON.parse(data);
                    json_data.user[message.member.id.toString()].moderation.ban ++; //Dem Moderator wird ein Bann hinzugefügt
                    json_data.user[member.id.toString()].vergehen.ban ++; //Dem User wird ein Bann hinzugefügt
                    fs.writeFile(`Server/${message.member.guild.id.toString()}.json`, JSON.stringify(json_data), () => {});
                });
            } else {
                const exampleEmbed = new MessageEmbed()
                    .setColor('RED')
                    .setTitle('Moderation')
                    .setDescription("The command was not executed correctly. Please make sure that all information is available.")
                    .addFields({name: 'Command:', value: "`#ban @member/id Reason`"})
                    .setTimestamp()

                message.channel.send({ embeds: [exampleEmbed] });
            }
        } catch (err) {
            await message.channel.send({content: "An error has occurred. Please try again. If the error still occurs, do not hesitate to contact us.", ephemeral: true});

            console.log("Ein Error ist bei #ban aufgetreten:\n");
            console.error(err);
            console.log("\n\n---------------------------------------\n\n");
        }
    }
}