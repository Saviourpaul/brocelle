import { put, list, del } from '@vercel/blob';

const DATA_FILENAME = 'borcelle-products.json';

export default async function handler(request, response) {
    // Add CORS headers to allow local development (Live Server) to talk to the API
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    try {
        // GET: Fetch products list
        if (request.method === 'GET') {
            const { blobs } = await list();
            const dataBlob = blobs.find(b => b.pathname === DATA_FILENAME);
            
            if (!dataBlob) return response.status(200).json([]);

            const res = await fetch(dataBlob.url + '?t=' + Date.now());
            const data = await res.json();
            return response.status(200).json(data);
        }

        // POST: Save products JSON or Upload Image
        if (request.method === 'POST') {
            const body = request.body;
            
            // If body is an array, we're saving the full products list JSON
            if (Array.isArray(body)) {
                const blob = await put(DATA_FILENAME, JSON.stringify(body), {
                    access: 'public',
                    addRandomSuffix: false, // Keep the same URL
                    contentType: 'application/json'
                });
                return response.status(200).json(blob);
            }

            // If it's single product upload (for future use or simpler logic)
            // Note: Since we are using browser fetch with multipart/form-data for images,
            // we will stick to a simpler JSON-based sync for the products file.
            return response.status(400).json({ message: 'Invalid data format' });
        }

        return response.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        console.error('API Error:', error);
        return response.status(500).json({ error: error.message });
    }
}
