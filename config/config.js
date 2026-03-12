module.exports = {
    // Bot configuration
    bot: {
        ownerId: process.env.BOT_OWNER_ID || null
    },
    
    // Verification settings
    verification: {
        cacheDuration: 3600000, // 1 hour in ms
        requireMinimumInscriptions: 1
    }
};
