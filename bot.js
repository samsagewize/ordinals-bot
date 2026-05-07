require('dotenv').config();
const { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');

// Load config & collections
const collections = require('./config/collections.json');

// Data storage
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'verified_users.json');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, JSON.stringify({}, null, 2));

function loadData() {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
}

function saveData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Utils
const { getAddressInscriptions } = require('./utils/ordinalsApi');

function isValidBitcoinAddress(address) {
    const bech32 = /^bc1[a-z0-9]{25,90}$/i;
    const legacy = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/;
    return bech32.test(address) || legacy.test(address);
}

// Verify user
async function verifyUser(userId, address, guild) {
    const data = loadData();
    const member = await guild.members.fetch(userId);

    try {
        const inscriptions = await getAddressInscriptions(address);
        
        if (!inscriptions || inscriptions.length === 0) {
            return { success: false, message: 'No Ordinals found for this address.' };
        }

        const userCollections = new Set();

        for (const inscription of inscriptions) {
            for (const [colName, colData] of Object.entries(collections)) {
                if (colData.genus && inscription.genus === colData.genus) {
                    userCollections.add(colName);
                }
                if (colData.inscriptionIds?.includes(inscription.id)) {
                    userCollections.add(colName);
                }
            }
        }

        // Assign roles
        let rolesAssigned = 0;
        for (const colName of userCollections) {
            const roleId = collections[colName].roleId;
            if (roleId) {
                const role = guild.roles.cache.get(roleId);
                if (role) {
                    await member.roles.add(role);
                    rolesAssigned++;
                }
            }
        }

        // Save
        data[userId] = {
            address,
            verifiedAt: new Date().toISOString(),
            collections: Array.from(userCollections),
            inscriptionCount: inscriptions.length
        };
        saveData(data);

        return {
            success: true,
            collections: Array.from(userCollections),
            inscriptionCount: inscriptions.length,
            rolesAssigned
        };

    } catch (error) {
        console.error(error);
        return { success: false, message: 'Verification failed. Try again later.' };
    }
}

// Discord Client
const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

client.once('ready', async () => {
    console.log(`✅ ${client.user.tag} is online!`);

    const commands = [
        new SlashCommandBuilder().setName('verify').setDescription('Verify your Ordinals')
            .addStringOption(opt => opt.setName('address').setDescription('Your BTC address').setRequired(true)),
        new SlashCommandBuilder().setName('check').setDescription('Check your verified holdings'),
        new SlashCommandBuilder().setName('collections').setDescription('List supported collections'),
        new SlashCommandBuilder().setName('unlink').setDescription('Unlink your address')
    ];

    await client.application.commands.set(commands);
    console.log('✅ Slash commands registered');
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const { commandName, user, guild } = interaction;

    if (commandName === 'verify') {
        await interaction.deferReply();
        const address = interaction.options.getString('address').trim();

        if (!isValidBitcoinAddress(address)) {
            return interaction.editReply('❌ Invalid Bitcoin address.');
        }

        const result = await verifyUser(user.id, address, guild);

        if (result.success) {
            const embed = new EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle('✅ Verification Successful!')
                .setDescription(`Found **${result.inscriptionCount}** Ordinals`)
                .addFields(
                    { name: 'Collections', value: result.collections.join(', ') || 'None', inline: true },
                    { name: 'Roles Assigned', value: result.rolesAssigned.toString(), inline: true }
                )
                .setFooter({ text: `Address: ${address.slice(0,8)}...${address.slice(-4)}` });

            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply(`❌ ${result.message}`);
        }
    }

    if (commandName === 'check') {
        const data = loadData();
        const userData = data[user.id];

        if (!userData) return interaction.reply("❌ You haven't verified yet.");

        const embed = new EmbedBuilder()
            .setColor(0x0099FF)
            .setTitle(`📊 ${user.username}'s Ordinals`)
            .addFields(
                { name: 'Address', value: `\`${userData.address}\`` },
                { name: 'Inscriptions', value: userData.inscriptionCount.toString(), inline: true },
                { name: 'Collections', value: userData.collections.join(', ') || 'None', inline: true }
            );

        await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'collections') {
        const embed = new EmbedBuilder()
            .setColor(0xFFD700)
            .setTitle('🎴 Supported Collections');

        Object.entries(collections).forEach(([name, data]) => {
            embed.addFields({ name: `${data.emoji} ${name}`, value: data.description });
        });

        await interaction.reply({ embeds: [embed] });
    }

    if (commandName === 'unlink') {
        const data = loadData();
        if (data[user.id]) {
            delete data[user.id];
            saveData(data);
            // Optional: remove roles here
            await interaction.reply('✅ Address unlinked.');
        } else {
            await interaction.reply("❌ No address linked.");
        }
    }
});

client.login(process.env.DISCORD_BOT_TOKEN);
