require('dotenv').config();
const fs = require('fs');
const path = require('path');
const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  PermissionsBitField,
  REST,
  Routes,
  SlashCommandBuilder
} = require('discord.js');

// Caminho do arquivo de configuração (pode ser usado para outras coisas, não só permissão)
const configPath = path.join(__dirname, 'config.json');

// Carrega configurações salvas (se existir)
let botConfig = { rolesPermitidos: [] };
if (fs.existsSync(configPath)) {
  try {
    botConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    if (!botConfig.rolesPermitidos) botConfig.rolesPermitidos = [];
  } catch (e) {
    console.error('Erro ao ler config.json', e);
  }
}

// ID do cargo "dono" – prioriza variável de ambiente (Railway), senão usa o config.json ou o valor fixo
const DONO_ROLE_ID = process.env.DONO_ROLE_ID || botConfig.rolesPermitidos[0] || '1485804876226363545';

// Cria o cliente com as intents necessárias
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMembers   // obrigatório para acessar member.roles
  ]
});

// Função que verifica se o membro tem o cargo permitido
function temPermissao(member) {
  if (!member) return false;
  // Se DONO_ROLE_ID estiver vazio, ninguém pode usar comandos
  if (!DONO_ROLE_ID) return false;
  return member.roles.cache.has(DONO_ROLE_ID);
}

// ============= REGISTRO DE SLASH COMMANDS (executado uma vez no ready) =============
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde com Pong!'),
  // Você pode adicionar mais comandos aqui
].map(command => command.toJSON());

client.once('ready', async () => {
  console.log(`🤖 Bot logado como ${client.user.tag}`);

  try {
    const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
    console.log('📦 Registrando comandos globalmente (pode levar até 1 hora)...');
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.log('✅ Comandos registrados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao registrar comandos:', error);
  }
});

// ============= INTERAÇÕES COM SLASH COMMANDS =============
client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // Verifica permissão ANTES de executar qualquer comando
  if (!temPermissao(interaction.member)) {
    return interaction.reply({
      content: '❌ Você não tem permissão para usar este comando.',
      ephemeral: true // só ele vê
    });
  }

  // Comandos
  if (interaction.commandName === 'ping') {
    await interaction.reply('🏓 Pong!');
  }

  // Adicione mais comandos aqui...
});

// ============= LOGIN =============
client.login(process.env.DISCORD_TOKEN);