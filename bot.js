require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { verifyOrdinalHoldings, getAddressInscriptions } = require('./utils/ordinalsApi');
const fs = require('fs');
const path = require('path');

// Load config
const config = require('./config/config');
const collections = require('./config/collections.json');

// Simple JSON-based storage
const DATA_FILE = path.join(__dirname, 'data', 'verified_users.json');

function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify({}));
    }
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Initialize Discord client
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages
    ]
});

// Create slash commands
const verifyCommand = new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Verify your Bitcoin ordinal holdings')
    .addStringOption(option =>
        option.setName('address')
            .setDescription('Your Bitcoin address (starts with bc1, 1, or 3)')
            .setRequired(true));

const checkCommand = new SlashCommandBuilder()
    .setName('check')
    .setDescription('Check ordinal holdings for a user')
    .addUserOption(option =>
        option.setName('user')
            .setDescription('User to check (leave empty for yourself)'));

const collectionsCommand = new SlashCommandBuilder()
    .setName('collections')
    .setDescription('List supported ordinal collections');

const unlinkCommand = new SlashCommandBuilder()
    .setName('unlink')
    .setDescription('Unlink your Bitcoin address');

// Validate Bitcoin address (basic)
function isValidBitcoinAddress(address) {
    // Legacy (1...), SegWit (3...), Native SegWit (bc1...)
    const bech32Regex = /^bc1[a-z0-9]{25,90}$/i;
    const legacyRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    return bech32Regex.test(address) || legacyRegex.test(address);
}

// Verify and assign roles
async function verifyUser(userId, address, guild) {
    const data = loadData();
    const member = await guild.members.fetch(userId);
    
    try {
        // Get user's inscriptions
        const inscriptions = await getAddressInscriptions(address);
        
        if (!inscriptions || inscriptions.length === 0) {
            return { success: false, message: 'No ordinals found for this address!' };
        }

        // Check against configured collections
        const userCollections = new Set();
        const matchedInscriptions = [];
        
        for (const inscription of inscriptions) {
            for (const [colName, colData] of Object.entries(collections)) {
                if (colData.inscriptionIds && colData.inscriptionIds.includes(inscription.id)) {
                    userCollections.add(colName);
                    matchedInscriptions.push({ collection: colName, inscription: inscription });
                }
                // Check by genus/type if available
                if (colData.genus && inscription.genus === colData.genus) {
                    userCollections.add(colName);
                }
            }
        }

        // Assign roles
        const rolesToAssign = [];
        for (const colName of userCollections) {
            const colConfig = collections[colName];
            if (colConfig.roleId) {
                const role = guild.roles.cache.get(colConfig.roleId);
                if (role) {
                    rolesToAssign.push(role);
                    await member.roles.add(role);
                }
            }
        }

        // Save verified data
        data[userId] = {
            address: address,
            verifiedAt: new Date().toISOString(),
            collections: Array.from(userCollections),
            inscriptionCount: inscriptions.length
        };
        saveData(data);

        return {
            success: true,
            collections: Array.from(userCollections),
            inscriptionCount: inscriptions.length,
            rolesAssigned: rolesToAssign.length
        };

    } catch (error) {
        console.error('Verification error:', error);
        return { success: false, message: 'Error verifying holdings. Please try again.' };
    }
}

client.once('ready', async () => {
    console.log(`🤖 ${client.user.tag} is ready!`);
    
    // Register commands
    const commands = [
        verifyCommand,
        checkCommand,
        collectionsCommand,
        unlinkCommand
    ];
    
    await client.application.commands.set(commands);
    console.log('✓ Slash commands registered');
});

// Handle slash commands
client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    const { commandName, user, options, guild } = interaction;

    if (commandName === 'verify') {
        await interaction.deferReply();
        
        const address = options.getString('address').trim();
        
        if (!isValidBitcoinAddress(address)) {
            return interaction.editReply('❌ Invalid Bitcoin address! Must start with 1, 3, or bc1.');
        }

        const result = await verifyUser(user.id, address, guild);

        if (result.success) {
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('✅ Verification Successful!')
                .setDescription(`Found **${result.inscriptionCount}** ordinals`)
                .addFields(
                    { name: 'Collections Verified', value: result.collections.length > 0 ? result.collections.join(', ') : 'None yet' },
                    { name: 'Roles Assigned', value: result.rolesAssigned.toString() }
                )
                .setFooter({ text: `Address: ${address.slice(0, 8)}...${address.slice(-4)}` });

            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply(`❌ ${result.message}`);
        }
    }

    if (commandName === 'check') {
        const targetUser = options.getUser('user') || user;
        const data = loadData();
        const userData = data[targetUser.id];

        if (!userData) {
            return interaction.reply(`❌ ${targetUser.username} hasn't verified their ordinals yet.`);
        }

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`📊 ${targetUser.username}'s Ordinals`)
            .addFields(
                { name: 'Address', value: `\`${userData.address}\``, inline: false },
                { name: 'Total Inscriptions', value: userData.inscriptionCount.toString(), inline: true },
                { name: 'Collections', value: userData.collections.join(', ') || 'None', inline: true },
                { name: 'Verified', value: new Date(userData.verifiedAt).toLocaleDateString(), inline: true }
            );

        await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'collections') {
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('🎴 Supported Collections')
            .setDescription('Collections that can earn you roles:');

        for (const [name, data] of Object.entries(collections)) {
            embed.addFields({
                name: data.emoji + ' ' + name,
                value: data.description || 'Custom collection'
            });
        }

        await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'unlink') {
        const data = loadData();
        
        if (data[user.id]) {
            delete data[user.id];
            saveData(data);
            
            // Remove roles
            const member = await guild.members.fetch(user.id);
            for (const [, colData] of Object.entries(collections)) {
                if (colData.roleId) {
                    const role = guild.roles.cache.get(colData.roleId);
                    if (role) await member.roles.remove(role);
                }
            }
            
            await interaction.reply('✅ Your address has been unlinked and roles removed.');
        } else {
            await interaction.reply('❌ You haven\'t linked an address yet.');
        }
    }
});

// Start bot
client.login(process.env.DISCORD_BOT_TOKEN);
