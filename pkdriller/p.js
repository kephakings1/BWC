const { zokou } = require(__dirname + "/../framework/zokou");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

moment.tz.setDefault(conf.TZ);

zokou({
  nomCom: "owner",
  aliases: ["dev", "creator"],
  categorie: "General"
}, async (dest, zk, commandeOptions) => {

  const { ms } = commandeOptions;

  try {

    const time = moment().format("HH:mm:ss");
    const date = moment().format("DD/MM/YYYY");

    let msg = `╭─❏ *👑 sir bravin *\n` +
              `│\n` +
              `│ 👤 Name: *PKDRILLER*\n` +
              `│ 🌍 Country: *wide🌎*\n` +
              `│ 📆 Date: *${date}*\n` +
              `│ 🕒 Time: *${time}*\n` +
              `│\n` +
              `│ 💬 WhatsApp: wa.me/${conf.NUMERO_OWNER}\n` +
              `│ 🌐 GitHub: https://aurabxmd.vercel.app/` +
              `│\n` +
              `╰───────────────❏`;

    await zk.sendMessage(dest, {
      text: msg,
      contextInfo: {
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "https://aurabxmd.vercel.app/",
          newsletterName: "AURA-BXMD",
          serverMessageId: 143
        },
        externalAdReply: {
          title: "👑 AURA-BXMD DEVELOPER",
          body: "Powered by sir bravin ⚡",
          thumbnailUrl: "https://files.catbox.moe/e2rhpu.jpg",
          sourceUrl: conf.GURL,
          mediaType: 1,
          renderLargerThumbnail: true
        }
      }
    }, { quoted: ms });

  } catch (e) {
    console.log("❌ Owner Command Error:", e);
    await zk.sendMessage(dest, { text: `❌ Error: ${e}` }, { quoted: ms });
  }

});
