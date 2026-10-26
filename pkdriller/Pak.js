'use strict';

const { zokou } = require(__dirname + "/../framework/zokou");
const axios = require("axios");
const moment = require("moment-timezone");
const conf = require(__dirname + "/../set");

moment.tz.setDefault(conf.TZ);

zokou({ nomCom: "apk", categorie: "Download", reaction: "📱" }, async (dest, zk, commandeOptions) => {
    const { ms, arg } = commandeOptions;

    try {
        if (!arg[0]) {
            return zk.sendMessage(dest, {
                text: `╭─❏ *📱 AURA-BXMD APK DOWNLOADER*\n` +
                      `│\n` +
                      `│ 📌 Usage: *apk <app name>*\n` +
                      `│ 📌 Example: *apk facebook*\n` +
                      `│\n` +
                      `╰───────────────❏`,
            }, { quoted: ms });
        }

        const query = encodeURIComponent(arg.join(" "));
        const searchUrl = `https://ws75.aptoide.com/api/7/apps/search/query=${query}`;

        const { data } = await axios.get(searchUrl);

        if (!data?.datalist?.list?.length) {
            return zk.sendMessage(dest, {
                text: `╭─❏ *📱 APK NOT FOUND*\n` +
                      `│\n` +
                      `│ ❌ App not found: *${arg.join(" ")}*\n` +
                      `│ 💡 Try another name\n` +
                      `│\n` +
                      `╰───────────────❏`
            }, { quoted: ms });
        }

        const app = data.datalist.list[0];

        const appName = app.name || "Unknown";
        const apkUrl = app.file?.path;
        const version = app.file?.vername || "Unknown";
        const size = app.file?.filesize 
            ? `${Math.round(app.file.filesize / 1048576)} MB` 
            : "Unknown";

        if (!apkUrl) {
            return zk.sendMessage(dest, {
                text: `╭─❏ *⚠️ DOWNLOAD ERROR*\n` +
                      `│\n` +
                      `│ ❌ APK not available\n` +
                      `│ 📱 App: *${appName}*\n` +
                      `│\n` +
                      `╰───────────────❏`
            }, { quoted: ms });
        }

        const time = moment().format("HH:mm:ss");
        const date = moment().format("DD/MM/YYYY");

        const msg = `╭─❏ *📱 AURA-BXMD APK INFO*\n` +
                    `│\n` +
                    `│ 📦 App: *${appName}*\n` +
                    `│ 🏷 Version: *${version}*\n` +
                    `│ 📊 Size: *${size}*\n` +
                    `│\n` +
                    `│ 📆 Date: *${date}*\n` +
                    `│ 🕒 Time: *${time}*\n` +
                    `│\n` +
                    `╰───────────────❏`;

        // 📤 Send APK with caption
        await zk.sendMessage(dest, {
            document: { url: apkUrl },
            fileName: `${appName}.apk`,
            mimetype: "application/vnd.android.package-archive",
            caption: msg,
            contextInfo: {
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: "120363419969992177@newsletter",
                    newsletterName: "AURA-BXMD",
                    serverMessageId: 143
                },
                externalAdReply: {
                    title: `📱 ${appName}`,
                    body: `Version ${version} • ${size}`,
                    thumbnailUrl: conf.LOGO,
                    sourceUrl: apkUrl,
                    mediaType: 1
                }
            }
        }, { quoted: ms });

    } catch (error) {
        console.error("❌ APK Command Error:", error);

        await zk.sendMessage(dest, {
            text: `╭─❏ *❌ APK ERROR*\n` +
                  `│\n` +
                  `│ ${error.message}\n` +
                  `│\n` +
                  `╰───────────────❏`
        }, { quoted: ms });
    }
});
