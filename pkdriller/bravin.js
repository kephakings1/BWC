const { zokou } = require("../framework/zokou");
const { repondre } = require("../framework/utils/messages"); // IMPORTANT
const { downloadMediaMessage } = require('@whiskeysockets/baileys');
const fs = require("fs-extra");
const ffmpeg = require("fluent-ffmpeg");
const { Catbox } = require('node-catbox');

const catbox = new Catbox();

async function uploadToCatbox(Path) {
    if (!fs.existsSync(Path)) {
        throw new Error("File does not exist");
    }
    try {
        const response = await catbox.uploadFile({ path: Path });
        if (response) return response;
        else throw new Error("Error retrieving the file link");
    } catch (err) {
        throw new Error(String(err));
    }
}

async function convertToMp3(inputPath, outputPath) {
    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .toFormat("mp3")
            .on("error", (err) => reject(err))
            .on("end", () => resolve(outputPath))
            .save(outputPath);
    });
}

zokou({ nomCom: "url", categorie: "General", reaction: "👨🏿‍💻" }, async (dest, zk, commandeOptions) => {
    const { msgRepondu, ms } = commandeOptions;

    if (!msgRepondu) {
        return repondre(zk, dest, ms, 'Please reply to an image, video, or audio file.');
    }

    let mediaPath, mediaType;

    if (msgRepondu.videoMessage) {
        const videoSize = msgRepondu.videoMessage.fileLength;
        if (videoSize > 50 * 1024 * 1024) {
            return repondre(zk, dest, ms, 'The video is too long. Please send a smaller video.');
        }
        mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.videoMessage);
        mediaType = 'video';
    } else if (msgRepondu.imageMessage) {
        mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.imageMessage);
        mediaType = 'image';
    } else if (msgRepondu.audioMessage) {
        mediaPath = await zk.downloadAndSaveMediaMessage(msgRepondu.audioMessage);
        mediaType = 'audio';
        const outputPath = `${mediaPath}.mp3`;
        try {
            await convertToMp3(mediaPath, outputPath);
            fs.unlinkSync(mediaPath);
            mediaPath = outputPath;
        } catch (error) {
            console.error("Error converting audio to MP3:", error);
            return repondre(zk, dest, ms, 'Failed to process the audio file.');
        }
    } else {
        return repondre(zk, dest, ms, 'Unsupported media type. Reply with an image, video, or audio file.');
    }

    try {
        const catboxUrl = await uploadToCatbox(mediaPath);
        fs.unlinkSync(mediaPath);

        repondre(zk, dest, ms, `*JEEPERS CREEPER-XMD URL*\n\n${catboxUrl}`);
        
    } catch (error) {
        console.error('Error while creating your URL:', error);
        repondre(zk, dest, ms, 'Oops, an error occurred.');
    }
});
