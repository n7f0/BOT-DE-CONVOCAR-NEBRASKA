require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { 
    Client, 
    GatewayIntentBits, 
    EmbedBuilder, 
    PermissionsBitField, 
    REST, 
    Routes
} = require('discord.js');

// Caminho do arquivo de configuração
const configPath = path.join(__dirname, 'config.json');

// Tenta ler as configurações salvas
let botConfig = { rolesPermitidos: [] };
if (fs.existsSync(configPath)) {
    try {
        botConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (!botConfig.rolesPermitidos) botConfig.rolesPermitidos = [];
    } catch (e) {
        console.error("Erro ao ler config.json", e);
    }
}

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
});

// EVENTO: Quando o bot ficar online
client.once('ready', () => {
    console.log(`✅ Bot está online como ${client.user.tag}`);
});

// EVENTO: Quando receber uma mensagem
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    
    // COMANDO EXEMPLO
    if (message.content === '!ping') {
        await message.reply('Pong! 🏓');
    }
    
    if (message.content === '!teste') {
        await message.reply('Bot funcionando!');
    }
});

// Coloque AQUI todo o resto do seu código do bot
// (comandos de áudio, moderação, etc.)

// Login do bot
client.login(process.env.DISCORD_TOKEN);
