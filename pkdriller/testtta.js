const { zokou } = require("../framework/zokou");

zokou({ nomCom: "testgp", categorie: "Test" }, async (dest, zk, { ms }) => {
    await zk.sendMessage(dest, { text: "Bot is reading groups ✅\nGroup: " + dest }, { quoted: ms });
});
