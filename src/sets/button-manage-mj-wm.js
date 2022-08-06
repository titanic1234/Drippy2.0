//Set Button Manage Automod Ignorde Channels

const { MessageActionRow, MessageButton, MessageEmbed, Permissions} = require('discord.js');
const fs = require('fs');

module.exports = {
    name: "setbuttonmanagemjwm",
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
                .setTitle("Settings - Management - Member Join - Welcome Message")
                .setDescription("What exactly do you want to set? Just click the button below.")
                .setColor("#003cff")
                .setFields(
                    {name: "Edit the welcome message text", value: "Button: Edit"},
                    {name: "Reset the welcome message text", value: "Button: Reset"},
                    {name: "Show show the welcome message text", value: "Button: Show"},
                    {
                        name: "\n\nINFO",
                        value: "More functions will be add channed. More detailed information on the individual functions can be obtained with #help"
                    }
                )
                .setTimestamp()
                .setThumbnail(message.message.guild.iconURL())

            var dis = false;

            if (json_data.memberjoin.message == null) {
                dis = true;
            }


            const buttonsManage = {
                "type": 1,
                "components": [
                    {
                        "type": 2,
                        "label": "Edit",
                        "style": 1,
                        "custom_id": `setManageMJWME:::${message.member.id}`
                    },
                    {
                        "type": 2,
                        "label": "Reset",
                        "style": 1,
                        "custom_id": `setManageMJWMR:::${message.member.id}`,
                        "disabled": dis
                    },
                    {
                        "type": 2,
                        "label": "Show",
                        "style": 1,
                        "custom_id": `setManageMJWMS:::${message.member.id}`
                    },
                    {
                        "type": 2,
                        "label": "Back",
                        "style": 4,
                        "custom_id": `setManageMJBack:::${message.member.id}`
                    }
                ]
            };

            var aktbutton;

            if (json_data.memberjoin.infos.aktiviert) {
                aktbutton = {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "label": "Deactivate Welcome Message",
                            "style": 4,
                            "custom_id": `setManageMJWMDA:::${message.member.id}`
                        }
                    ]
                }
            } else {
                aktbutton = {
                    "type": 1,
                    "components": [
                        {
                            "type": 2,
                            "label": "Activate Welcome Message",
                            "style": 3,
                            "custom_id": `setManageMJWMA:::${message.member.id}`
                        }
                    ]
                }
            }


            await message.message.delete();
            await message.channel.send({embeds: [setManageEmbed], ephemeral: true, components: [buttonsManage, aktbutton]});
        });
    }
}