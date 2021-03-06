import { ICommand } from "wokcommands";
import DiscordJS, { GuildMember, MessageEmbed, TextChannel } from 'discord.js'

export default {
    category: 'Logging',
    description: 'Logs items put into the weapons storage and taken out.',
    slash: 'both',
    testOnly: true,
    minArgs: 4,
    expectedArgs: '<in_out> <item> <amount> <server time> <notes>',
    options: [
        {
            name: 'in_out',
            description: 'Mention if you are taking the item or puttiung it in storage.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'item',
            description: 'The item you added to shared storage. Ex: battery.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'amount',
            description: 'How many of the item you put in.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: 'time',
            description: 'Server time Ex: 20:30.',
            required: true,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        },
        {
            name: 'notes',
            description: 'Optional notes. Ex: Put in for jonny or removed for nathan.',
            required: false,
            type: DiscordJS.Constants.ApplicationCommandOptionTypes.STRING
        }
    ],
    callback: async ({ message, interaction: msgInt, args }) => {
        try {
            const options = ['in', 'out']
            const item = args[1]
            const amount = args[2]
            const time = args[3]
            const IO = args[0]
            const desc = args[4]
            const author = message ? message.author : msgInt.user
            var adminChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908023484842643567')) as TextChannel
            var mainChannel = (message ? message.guild : msgInt.guild?.channels.cache.get('908041261947166750')) as TextChannel
            if (IO !in options) {
                msgInt.reply({
                    content: 'Please use `in` or `out`!',
                    ephemeral: true
                })
            }
            if (IO === 'in') {
                var label = 'put in'
            } else {
                var label = 'taken'
            }
            if (desc) {
                var description = desc
            } else {
                description = "No notes added."
            }
            const embed = new DiscordJS.MessageEmbed()
                .setDescription(`A new item has been ${label} by <@${author.id}>!\n\n${description}`)
                .addField('Item', item, true)
                .addField('Amount', amount, true)
                .addField('Time', time, true)
                .setThumbnail('https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/160/apple/48/pistol_1f52b.png')
                if (IO === 'in') {
                    var label = 'put in'
                    embed.setColor('GREEN')
                } else {
                    var label = 'taken'
                    embed.setColor('RED')
                }
            await mainChannel.send({embeds: [embed]})
            await adminChannel.send({embeds: [embed]})
            if (msgInt) {
                msgInt.reply({
                    content: 'Submitted your log!',
                    ephemeral: true
                })
            }
        } catch(error) {
            const embed = new MessageEmbed()
                .setColor('RED')
                .addField('Error:', `\`\`\`\n${error}\`\`\``, false)
            return msgInt.reply({
               content: `<@827940585201205258> What the there was an error!?`,
               embeds: [embed]
            })
        }
    }
} as ICommand