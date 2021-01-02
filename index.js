require('dotenv').config();

const discord = require('discord.js');
const dedent = require('dedent');
const utils = require('./extras/utils');

const client = new discord.Client();

client.on('ready', async () => {
  await client.user.setActivity('-info', { type: 'LISTENING' });
});

client.on('message', async message => {
  if (message.content.match(/^\-(i|info)$/)) {
    await message.react('😎');
    await message.channel.send(
      new discord.MessageEmbed({
        author: {
          name: 'Among US Bot',
          iconURL:
            'https://cdn.discordapp.com/avatars/756745742261157910/5b93edacbf552e0ee3451531e6b38303.png?size=256',
        },
        description: 'Mute your friends in among us!',
        fields: [
          {
            name: 'Commands',
            value: dedent`
                \`-m|-mute\` to mute.
                \`-u|-unmute\` to unmute.
                \`-i|-info\` for help.
              `,
          },
        ],
        footer: {
          text: "wadu's mutebot",
        },
      })
    );
  }

  if (message.content.match(/^\-(m|mute)$/)) {
    if (utils.channel.notInVoiceChannel(message.member)) {
      await message.react('😐');
      await message.reply("❌ You're not in a voice channel!");
    } else {
      await message.react('👍🏻');
      await message.channel.send('🔇 Muted!');
      await utils.channel.setGlobalMuteState(
        message.member.voice.channel.members,
        true
      );
    }
  }

  if (message.content.match(/^\-(u|unmute)$/)) {
    if (utils.channel.notInVoiceChannel(message.member)) {
      await message.react('😐');
      await message.reply("❌ You're not in a voice channel!");
    } else {
      await message.react('👍🏻');
      await message.channel.send('🔊 Now speak!');
      await utils.channel.setGlobalMuteState(
        message.member.voice.channel.members,
        false
      );
    }
  }
});

utils.client.startClient(client, process.env.DISCORD_BOT_TOKEN);
