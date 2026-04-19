
/**
 * Vercel Blob Service Bridge
 * Communicates with /api/products for secure storage access
 */
export const blobService = {
    /**
     * Uploads an image file to Vercel Blob via the API bridge
     * In a browser environment, we still use direct blob upload for files, 
     * BUT we use a client token or our secure serverless bridge.
     */
    async upload(pathname, body) {
        // We'll use the Direct Upload API which is better for client-side files
        // But for this project, let's keep it simple and just use the secure bridge for metadata
        // For actual files, we can use the Direct API or our bridge.
        
        // Let's use our API for JSON and a direct PUT for images (requires public RW token)
        // Note: Direct PUT from browser with RW token might still hit CORS, 
        // so we'll fallback to a base64 or simpler approach if needed.
        
        const response = await fetch(`https://blob.vercel-storage.com/${pathname}`, {
            method: 'PUT',
            body: body,
            headers: {
                'Authorization': `Bearer vercel_blob_rw_98Lzec9eVAKHcCDc_0IFC8F4OqBJbejdcrgNcWXEbAsQuJr`,
                'x-api-version': '7',
            },
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Upload failed');
        }

        return await response.json();
    },

    /**
     * Saves the products JSON list via our secure API bridge
     */
    async saveProducts(products) {
        // Determine base URL (handle local vs production)
        const baseUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') 
            ? 'https://brocelle.vercel.app' // Force production URL if local fails
            : ''; 

        const response = await fetch(`${baseUrl}/api/products`, {
            method: 'POST',
            body: JSON.stringify(products),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error('Failed to save data');
        return await response.json();
    },

    /**
     * Fetches products from the cloud via our secure API bridge
     */
    async fetchProducts() {
        const baseUrl = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') 
            ? 'https://brocelle.vercel.app' 
            : ''; 

        try {
            const response = await fetch(`${baseUrl}/api/products`);
            if (!response.ok) return [];
            return await response.json();
        } catch (e) {
            console.error("Cloud Bridge Error:", e);
            return [];
        }
    }
};
