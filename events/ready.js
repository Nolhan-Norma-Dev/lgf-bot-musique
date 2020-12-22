const { Client, Message, MessageEmbed} = require("discord.js");
'use strict';

module.exports = {
    name: 'ready',
    execute: async function (client) {
      console.log(`${client.user.username} est connecter !`);
  
      let activities = [`m+help`, `© NordKey.Dév - 2020`, `by l'agriculteur normand#2755`, `by KeYoKs#0956`, `sur ${client.guilds.cache.size.toString()} serveurs`, `avec ${client.guilds.cache.map(g => g.memberCount).reduce((a, b) => a + b)} utilisateurs`], i = 0;
      setInterval(() => client.user.setPresence({ activity: { name: `${activities [i++ % activities.length]}`, type: 'PLAYING' }, status: 'online' }), 3000);
  
      const embed = new MessageEmbed()
      .setAuthor(`NordKey.Musique`, `https://zupimages.net/up/20/43/dce1.png`)
      .setColor(`#3D3D33`)
      .setDescription(`**Action :** Bot Démarré\n\n**Status :** opérationnel \n\n**Par :** l'agriculteur normand 2.0#2755`)
      .setTimestamp()
      .setFooter(`© 2020 | NordKey.Dév`, `https://zupimages.net/up/20/43/dce1.png`);

      client.channels.cache.get('769253373136207913').send(embed);
      
      client.infoApp = await client.fetchApplication();
      setInterval(async () => {
        client.infoApp = await client.fetchApplication();
      }, 3600000);
    },
};
