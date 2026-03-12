# Discord Ordinals Verification Bot

A Discord bot that verifies users' Bitcoin Ordinals holdings and assigns roles based on their collection.

## Features

- 🔗 **Wallet Linking**: Users link their Bitcoin address to Discord
- ✅ **Ordinal Verification**: Checks if address holds specific ordinals/collections
- 🎭 **Auto-Roles**: Assigns roles based on holdings
- 📊 **Collection Tracking**: Support for popular Ordinal collections

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with your bot token
npm start
```

## Commands

- `/verify <bitcoin_address>` - Link and verify ordinal holdings
- `/check [user]` - Check another user's verified ordinals
- `/collections` - List supported collections
- `/unlink` - Remove your linked address

## Environment Variables

```
DISCORD_BOT_TOKEN=your_token
BOT_OWNER_ID=your_discord_id
```

## Supported Collections

Configure in `config/collections.json` - add any collection by inscription ID or name.
