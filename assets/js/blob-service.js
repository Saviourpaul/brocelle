
/**
 * Vercel Blob Service Secure Bridge
 * Resolves "Failed to fetch" errors by using server-side storage access
 */
export const blobService = {
    /**
     * Helper to get API URL
     */
    getApiUrl() {
        // Use relative path if on Vercel domain
        if (!window.location.origin.includes('localhost') && !window.location.origin.includes('127.0.0.1')) {
            return '/api/products';
        }
        // Force Vercel URL if working locally to bypass local server lack of Node.js support
        return 'https://brocelle.vercel.app/api/products';
    },

    /**
     * Uploads an image file by converting to base64 and sending to the API bridge
     */
    async upload(filename, file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                try {
                    const response = await fetch(this.getApiUrl(), {
                        method: 'POST',
                        body: JSON.stringify({
                            type: 'image',
                            data: reader.result,
                            filename: `${Date.now()}_${filename}`,
                            contentType: file.type
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    });

                    if (!response.ok) throw new Error('Upload via bridge failed');
                    resolve(await response.json());
                } catch (e) {
                    reject(e);
                }
            };
            reader.onerror = error => reject(error);
        });
    },

    /**
     * Saves the products JSON list via the secure API bridge
     */
    async saveProducts(products) {
        const response = await fetch(this.getApiUrl(), {
            method: 'POST',
            body: JSON.stringify({
                type: 'json',
                data: products
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to save data');
        return await response.json();
    },

    /**
     * Fetches products via the secure API bridge
     */
    async fetchProducts() {
        try {
            const response = await fetch(this.getApiUrl());
            if (!response.ok) return [];
            return await response.json();
        } catch (e) {
            console.error("Cloud Bridge Fetch Error:", e);
            throw e;
        }
    }
};
