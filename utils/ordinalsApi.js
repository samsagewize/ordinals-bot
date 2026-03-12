const https = require('https');

/**
 * Fetch address inscriptions from mempool.space API
 * @param {string} address - Bitcoin address
 * @returns {Promise<Array>} Array of inscriptions
 */
async function getAddressInscriptions(address) {
    try {
        // First get the address on mempool
        const addressInfo = await fetchJson(`https://mempool.space/api/address/${address}`);
        
        if (!addressInfo || !addressInfo.chain_stats) {
            return [];
        }

        // Check if address has any transactions
        const txCount = addressInfo.chain_stats.tx_count;
        if (txCount === 0) {
            return [];
        }

        // For now, return basic info - full ordinals need more complex queries
        // mempool.space has limited ordinal data, we'd need ordinals.com for full data
        // Return mock structure that can be expanded
        
        // Try to get inscriptions for this address via ordinals API
        const ordinals = await getOrdinalsForAddress(address);
        
        return ordinals;
        
    } catch (error) {
        console.error('Error fetching address:', error.message);
        return [];
    }
}

/**
 * Fetch ordinals for address from ordinals.com
 */
async function getOrdinalsForAddress(address) {
    try {
        // ordinals.com API
        const response = await fetchJson(`https://ordinals.com/api/address/${address}`);
        
        if (response && response.inscriptions) {
            return response.inscriptions.map(inscr => ({
                id: inscr.id,
                number: inscr.num,
                address: address
            }));
        }
        
        return [];
    } catch (error) {
        // Fallback: try mempool ordinals endpoint
        try {
            const response = await fetchJson(`https://mempool.space/api/ordinals/inscriptions/address/${address}`);
            return response || [];
        } catch (e) {
            console.error('All ordinal APIs failed:', e.message);
            return [];
        }
    }
}

/**
 * Verify if address holds specific inscription
 */
async function verifyOrdinalHoldings(address, requiredInscriptionIds = []) {
    const inscriptions = await getAddressInscriptions(address);
    
    const userIds = new Set(inscriptions.map(i => i.id));
    
    return requiredInscriptionIds.filter(id => userIds.has(id));
}

/**
 * Generic JSON fetch helper
 */
function fetchJson(url) {
    return new Promise((resolve, reject) => {
        const req = https.get(url, {
            headers: {
                'User-Agent': 'DiscordOrdinalBot/1.0'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    resolve(null);
                }
            });
        });
        
        req.on('error', reject);
        req.setTimeout(10000, () => {
            req.destroy();
            reject(new Error('Request timeout'));
        });
    });
}

/**
 * Get inscription details
 */
async function getInscriptionDetails(inscriptionId) {
    try {
        const response = await fetchJson(`https://ordinals.com/r/inscription/${inscriptionId}`);
        return response;
    } catch (error) {
        return null;
    }
}

module.exports = {
    getAddressInscriptions,
    verifyOrdinalHoldings,
    getInscriptionDetails
};
