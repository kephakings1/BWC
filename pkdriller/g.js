const { zokou } = require("../framework/zokou");

zokou({ nomCom: "grouptest1", categorie: "Test" }, async (dest, zk, { ms }) => {
    await zk.sendMessage(dest, { text: "I can see group messages ✅" }, { quoted: ms });
});
