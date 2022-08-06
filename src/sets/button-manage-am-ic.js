//Set Button Manage Automod Ignorde Channels

const { MessageActionRow, MessageButton, MessageEmbed, Permissions} = require('discord.js');
const fs = require('fs');

module.exports = {
    name: "setbuttonmanageamic",
    description: "Settings",
    async execute (client, message) {
        fs.readFile(`Server/${message.message.member.guild.id.toString()}.json`, "utf8", async function (err, data) {
            if (err) {
                console.log(err);
            }

            var json_data = JSON.parse(data);
            var adminroles = json_data.moderation.roles_admin;
            var modroles = json_data.moderation.roles_mod;
            var modberecht = false;
            var adminberecht = false;


            for (var i of message.message.member._roles) {
                if (message.message.guild.ownerId.toString() === message.message.member.id.toString()) {
                    adminberecht = true;
                    modberecht = true;
                    break;
                }
                if (message.message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
                    adminberecht = true;
                    modberecht = true;
                    break;
                }
                if (adminroles.includes(i.toString())) {
                    adminberecht = true;
                    break;
                }
                if (modroles.includes(i.toString())) {
                    modberecht = true;
                    break;
                }
            }

            if (modberecht === false) {
                return client.commands.get("permission_error").execute(client, message);
            }


            const setManageEmbed = new MessageEmbed()
                .setTitle("Settings - Management - Automod - Ignored channels")
                .setDescription("What exactly do you want to set? Just click the button below.")
                .setColor("#003cff")
                .setFields(
                    {name: "Add a Ignored channel", value: "Button: Add"},
                    {name: "Remove a Ignored channel", value: "Button: Remove"},
                    {name: "Show all Ignored channels", value: "Button: Show"},
                    {
                        name: "\n\nINFO",
                        value: "More functions will be add channed. More detailed information on the individual functions can be obtained with #help"
                    }
                )
                .setTimestamp()
                .setThumbnail(message.message.guild.iconURL())

            const buttonsManage = {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "Add",
                        "style": 1,
                        "custom_id": `setManageAMICA:::${message.member.id}`
                    },
                    {
                        "type": 2,
                        "label": "Remove",
                        "style": 1,
                        "custom_id": `setManageAMICR:::${message.member.id}`
                    },
                    {
                        "type": 2,
                        "label": "Show",
                        "style": 1,
                        "custom_id": `setManageAMICS:::${message.member.id}`
                    },
                    {
                        "type": 2,
                        "label": "Back",
                        "style": 4,
                        "custom_id": `setManageAMBack:::${message.member.id}`
                    }
                ]
            };


            await message.message.delete();
            await message.channel.send({embeds: [setManageEmbed], ephemeral: true, components: [buttonsManage]});
        });
    }
}