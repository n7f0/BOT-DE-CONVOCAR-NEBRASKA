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

// Cole aqui o restante do seu código completo do index.js enviado anteriormente
client.login(process.env.DISCORD_TOKEN);
