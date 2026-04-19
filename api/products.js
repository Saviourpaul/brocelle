import { put, list } from '@vercel/blob';

const DATA_FILENAME = 'borcelle-products.json';

export default async function handler(request, response) {
    // Enable CORS
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (request.method === 'OPTIONS') {
        return response.status(200).end();
    }

    // Ensure we have the token (Vercel automatically provides this if connected)
    const token = process.env.BLOB_READ_WRITE_TOKEN || 'vercel_blob_rw_98Lzec9eVAKHcCDc_0IFC8F4OqBJbejdcrgNcWXEbAsQuJr';

    try {
        // GET: Fetch products list
        if (request.method === 'GET') {
            const { blobs } = await list({ token });
            const dataBlob = blobs.find(b => b.pathname === DATA_FILENAME);
            
            if (!dataBlob) return response.status(200).json([]);

            const res = await fetch(dataBlob.url + '?t=' + Date.now());
            const data = await res.json();
            return response.status(200).json(data);
        }

        // POST: Save products or Upload Image
        if (request.method === 'POST') {
            const { type, data, filename, contentType } = request.body;
            
            // Save full products JSON
            if (type === 'json') {
                const blob = await put(DATA_FILENAME, JSON.stringify(data), {
                    token,
                    access: 'public',
                    addRandomSuffix: false,
                    contentType: 'application/json'
                });
                return response.status(200).json(blob);
            }

            // Upload Image (expecting base64 data)
            if (type === 'image' && data) {
                // Remove the data:image/xxx;base64, prefix
                const base64Data = data.split(',')[1];
                const buffer = Buffer.from(base64Data, 'base64');
                
                const blob = await put(`uploads/${filename}`, buffer, {
                    token,
                    access: 'public',
                    contentType: contentType || 'image/png'
                });
                return response.status(200).json(blob);
            }
        }

        return response.status(405).json({ message: 'Method not allowed' });
    } catch (error) {
        console.error('Vercel API Error:', error);
        return response.status(500).json({ error: error.message });
    }
}
