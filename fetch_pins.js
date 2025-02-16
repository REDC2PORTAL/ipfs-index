require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const PINATA_API_URL = "https://api.pinata.cloud/data/pinList";
const PINATA_JWT = process.env.PINATA_JWT;

async function fetchPinataFiles() {
    try {
        const response = await axios.get(PINATA_API_URL, {
            headers: { "Authorization": `Bearer ${PINATA_JWT}` }
        });

        console.log("📥 Raw response from Pinata:", response.data); // Debugging Log

        const files = response.data.rows.map(file => ({
            filename: file.metadata.name || "Unknown",
            cid: file.ipfs_pin_hash,
            size: file.size,
            date_added: file.date_pinned,
            description: file.metadata.keyvalues?.description || "N/A"
        }));

        console.log("📄 Parsed IPFS files:", files); // Debugging Log

        fs.writeFileSync("ipfs_index.json", JSON.stringify({ index: files }, null, 4));

        console.log("✅ IPFS index updated successfully!");
    } catch (error) {
        console.error("❌ Error fetching from Pinata:", error);
    }
}

fetchPinataFiles();
