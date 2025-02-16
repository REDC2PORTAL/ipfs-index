require('dotenv').config();
const fs = require('fs');
const axios = require('axios');

const PINATA_API_URL = "https://api.pinata.cloud/data/pinList";
const PINATA_JWT = process.env.PINATA_JWT;

async function fetchPinataFiles() {
    try {
        console.log("🔍 Fetching data from Pinata...");
        console.log("Using JWT: ", PINATA_JWT ? "✅ Exists" : "❌ Missing");

        const response = await axios.get(PINATA_API_URL, {
            headers: { "Authorization": `Bearer ${PINATA_JWT}` }
        });

        console.log("📥 API Response:", response.data); // Debugging log

        if (!response.data.rows.length) {
            console.warn("⚠️ No pinned files found on Pinata.");
            return;
        }

        const files = response.data.rows.map(file => ({
            filename: file.metadata.name || "Unknown",
            cid: file.ipfs_pin_hash,
            size: file.size,
            date_added: file.date_pinned,
            description: file.metadata.keyvalues?.description || "N/A"
        }));

        console.log("📁 Processed files:", files);

        fs.writeFileSync("ipfs_index.json", JSON.stringify({ index: files }, null, 4));
        console.log("✅ IPFS index updated successfully!");
    } catch (error) {
        console.error("❌ Error fetching from Pinata:", error.response?.data || error.message);
    }
}

fetchPinataFiles();
