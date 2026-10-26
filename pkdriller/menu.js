// menu.js - Modified Menu System for Zokou Bot

const config = require('./config');
const { commands } = require('./commands');

// Main menu function
async function sendMenu(m, conn) {
    try {
        const sender = m.sender;
        const pushname = m.pushName || 'User';
        
        // Menu header with Zokou branding
        let menuText = `╔═══════════════════════╗\n`;
        menuText += `║    🤖 ZOKOU BOT MENU   ║\n`;
        menuText += `╚═══════════════════════╝\n\n`;
        
        menuText += `┌─ ❏ *USER INFO*\n`;
        menuText += `│  👤 Name: ${pushname}\n`;
        menuText += `│  📱 Number: ${sender.split('@')[0]}\n`;
        menuText += `│  📅 Date: ${new Date().toLocaleDateString()}\n`;
        menuText += `│  ⏰ Time: ${new Date().toLocaleTimeString()}\n`;
        menuText += `└──────────────────\n\n`;
        
        menuText += `┌─ ❏ *BOT STATISTICS*\n`;
        menuText += `│  ⏱️ Uptime: ${await getUptime()}\n`;
        menuText += `│  📊 Commands: ${commands.length}\n`;
        menuText += `│  👥 Users: ${await getTotalUsers()}\n`;
        menuText += `└──────────────────\n\n`;
        
        menuText += `┌─ ❏ *AVAILABLE COMMANDS*\n`;
        
        // Categorized commands
        const categories = {
            '📱 General': [],
            '🎮 Fun': [],
            '📷 Media': [],
            '🔧 Utility': [],
            '🎵 Music': [],
            '🛡️ Admin': [],
            '💼 Owner': []
        };
        
        // Organize commands by category
        commands.forEach(cmd => {
            const category = cmd.category || '📱 General';
            if (categories[category]) {
                categories[category].push(cmd);
            } else {
                categories['📱 General'].push(cmd);
            }
        });
        
        // Display commands by category
        for (const [category, cmdList] of Object.entries(categories)) {
            if (cmdList.length > 0) {
                menuText += `│  ═══ ${category} ═══\n`;
                cmdList.forEach(cmd => {
                    const prefix = config.prefix || '.';
                    menuText += `│  ➤ ${prefix}${cmd.name}`;
                    if (cmd.alias && cmd.alias.length > 0) {
                        menuText += ` (${cmd.alias.join(', ')})`;
                    }
                    if (cmd.desc) {
                        menuText += ` - ${cmd.desc}`;
                    }
                    menuText += `\n`;
                });
            }
        }
        
        menuText += `└──────────────────\n\n`;
        
        // Footer with info
        menuText += `┌─ ❏ *BOT INFORMATION*\n`;
        menuText += `│  📌 Prefix: ${config.prefix || '.'}\n`;
        menuText += `│  🧠 Owner: ${config.ownerName || 'Zokou'}\n`;
        menuText += `│  🌐 Version: ${config.version || '1.0.0'}\n`;
        menuText += `│  💬 Mode: ${config.mode || 'Public'}\n`;
        menuText += `└──────────────────\n\n`;
        
        menuText += `╔═══════════════════════╗\n`;
        menuText += `║   THANK YOU FOR USING  ║\n`;
        menuText += `║      ZOKOU BOT! 🚀     ║\n`;
        menuText += `╚═══════════════════════╝`;
        
        // Send menu with fancy formatting
        await conn.sendMessage(m.chat, {
            text: menuText,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterName: "Zokou Bot",
                    newsletterJid: "120363313708178065@newsletter"
                }
            }
        });
        
    } catch (error) {
        console.error('Error sending menu:', error);
        await m.reply('❌ Error loading menu. Please try again.');
    }
}

// Helper functions
async function getUptime() {
    const uptime = process.uptime();
    const days = Math.floor(uptime / 86400);
    const hours = Math.floor((uptime % 86400) / 3600);
    const minutes = Math.floor((uptime % 3600) / 60);
    const seconds = Math.floor(uptime % 60);
    
    if (days > 0) {
        return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else if (hours > 0) {
        return `${hours}h ${minutes}m ${seconds}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds}s`;
    } else {
        return `${seconds}s`;
    }
}

async function getTotalUsers() {
    // Implement your user counting logic here
    // This is a placeholder
    return '1000+';
}

// Alternative menu style - Compact version
async function sendCompactMenu(m, conn) {
    const prefix = config.prefix || '.';
    const pushname = m.pushName || 'User';
    
    let menu = `✨ *ZOKOU BOT MENU* ✨\n`;
    menu += `👤 ${pushname}\n`;
    menu += `━━━━━━━━━━━━━━━━━━\n\n`;
    
    // Quick command shortcuts
    menu += `*📋 COMMANDS:*\n`;
    menu += `┌  ${prefix}help - Show this menu\n`;
    menu += `├  ${prefix}ping - Check bot status\n`;
    menu += `├  ${prefix}sticker - Create sticker\n`;
    menu += `├  ${prefix}yt - Download YouTube\n`;
    menu += `├  ${prefix}ig - Download Instagram\n`;
    menu += `├  ${prefix}tt - Download TikTok\n`;
    menu += `├  ${prefix}weather - Check weather\n`;
    menu += `├  ${prefix}news - Get latest news\n`;
    menu += `├  ${prefix}quote - Random quote\n`;
    menu += `├  ${prefix}joke - Random joke\n`;
    menu += `├  ${prefix}tr - Translate text\n`;
    menu += `├  ${prefix}calc - Calculate\n`;
    menu += `├  ${prefix}ai - AI chatbot\n`;
    menu += `├  ${prefix}owner - Contact owner\n`;
    menu += `└  ${prefix}about - About bot\n\n`;
    
    menu += `💡 *Tip:* Use ${prefix}help <command> for details\n`;
    menu += `━━━━━━━━━━━━━━━━━━\n`;
    menu += `🤖 *Zokou v${config.version || '1.0.0'}*`;
    
    await conn.sendMessage(m.chat, { text: menu });
}

// Command handler for menu
async function menuCommand(m, conn) {
    const args = m.text.split(' ').slice(1);
    
    if (args.length > 0 && args[0].toLowerCase() === 'compact') {
        await sendCompactMenu(m, conn);
    } else {
        await sendMenu(m, conn);
    }
}

// Export for use in your main bot file
module.exports = {
    sendMenu,
    sendCompactMenu,
    menuCommand
};
