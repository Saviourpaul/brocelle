
const BLOB_TOKEN = 'vercel_blob_rw_98Lzec9eVAKHcCDc_0IFC8F4OqBJbejdcrgNcWXEbAsQuJr';
const DATA_FILENAME = 'borcelle-products.json';

/**
 * Vercel Blob Service
 */
export const blobService = {
    async upload(pathname, body, options = {}) {
        const response = await fetch(`https://blob.vercel-storage.com/${pathname}`, {
            method: 'PUT',
            body: body,
            headers: {
                'Authorization': `Bearer ${BLOB_TOKEN}`,
                'x-api-version': '7', 
                ...options.headers
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Upload failed' }));
            throw new Error(error.message || `Status: ${response.status}`);
        }

        return await response.json();
    },

    async list() {
        const response = await fetch('https://blob.vercel-storage.com/', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${BLOB_TOKEN}`,
                'x-api-version': '7',
            },
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'List failed' }));
            throw new Error(error.message || `Status: ${response.status}`);
        }
        return await response.json();
    },

    async saveProducts(products) {
        return await this.upload(DATA_FILENAME, JSON.stringify(products), {
            headers: { 'Cache-Control': 'no-cache', 'Content-Type': 'application/json' }
        });
    },

    async fetchProducts() {
        try {
            const { blobs } = await this.list();
            const dataBlob = blobs
                .filter(b => b.pathname === DATA_FILENAME)
                .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))[0];

            if (!dataBlob) return [];

            const response = await fetch(dataBlob.url + '?t=' + Date.now());
            if (!response.ok) return [];
            return await response.json();
        } catch (e) {
            console.error("Blob Service Error:", e);
            throw e; // Rethrow to let the UI handle it
        }
    }
};
