
import { blobService } from './blob-service.js';

const productList = document.getElementById('product-list');
const addProductForm = document.getElementById('addProductForm');
const editProductForm = document.getElementById('editProductForm');

let products = [];

// Load products on start
document.addEventListener('DOMContentLoaded', loadProducts);

async function loadProducts() {
    try {
        productList.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="spinner-border text-primary mb-3"></div>
                <p class="text-muted">Connecting to Vercel Cloud Storage...</p>
            </div>`;
        
        products = await blobService.fetchProducts();
        
        // If first time or empty, seed with all 16 default data items
        if (!products || products.length === 0) {
            console.log("No cloud data found. Seeding original catalog...");
            products = [
                { id: "1", name: "Organic Berries", price: 12.00, imageUrl: "assets/img/product/product1.png", status: "In Stock", description: "Freshly picked organic berries.", createdAt: new Date().toISOString() },
                { id: "2", name: "Red Tomatoes", price: 8.50, imageUrl: "assets/img/product/product2.png", status: "In Stock", description: "Sun-ripened organic tomatoes.", createdAt: new Date().toISOString() },
                { id: "3", name: "Fresh Sea Bream", price: 25.00, imageUrl: "assets/img/product/product3.png", status: "In Stock", description: "Freshly caught organic sea bream.", createdAt: new Date().toISOString() },
                { id: "4", name: "Organic Onions", price: 5.00, imageUrl: "assets/img/product/product4.png", status: "In Stock", description: "Farm-fresh organic onions.", createdAt: new Date().toISOString() },
                { id: "5", name: "Chili Peppers", price: 6.20, imageUrl: "assets/img/product/product5.png", status: "Low Stock", description: "Hot and spicy organic chili.", createdAt: new Date().toISOString() },
                { id: "6", name: "Green Bell Pepper", price: 4.80, imageUrl: "assets/img/product/product6.png", status: "In Stock", description: "Crunchy green bell peppers.", createdAt: new Date().toISOString() },
                { id: "7", name: "Spinach Bunches", price: 3.50, imageUrl: "assets/img/product/product7.png", status: "In Stock", description: "Organic nutrient-rich spinach.", createdAt: new Date().toISOString() },
                { id: "8", name: "Green Papaya", price: 15.00, imageUrl: "assets/img/product/product8.png", status: "In Stock", description: "Fresh unripe papaya for salads.", createdAt: new Date().toISOString() },
                { id: "9", name: "Organic Carrots", price: 4.00, imageUrl: "assets/img/product/product9.png", status: "In Stock", description: "Sweet and crunchy organic carrots.", createdAt: new Date().toISOString() },
                { id: "10", name: "Category Pack - Fruits", price: 45.00, imageUrl: "assets/img/product/categories1.png", status: "In Stock", description: "Bulk pack of assorted fruits.", createdAt: new Date().toISOString() },
                { id: "11", name: "Vegetable Basket", price: 38.00, imageUrl: "assets/img/product/categories2.png", status: "In Stock", description: "Mixed basket of seasonal vegetables.", createdAt: new Date().toISOString() },
                { id: "12", name: "Bakery Selection", price: 22.00, imageUrl: "assets/img/product/categories3.png", status: "In Stock", description: "Freshly baked organic breads.", createdAt: new Date().toISOString() },
                { id: "13", name: "Premium Fruit Box", price: 65.00, imageUrl: "assets/img/product/big-product1.jpg", status: "In Stock", description: "Large selection of premium organic fruits.", createdAt: new Date().toISOString() },
                { id: "14", name: "Gourmet Veggie Box", price: 55.00, imageUrl: "assets/img/product/big-product2.jpg", status: "In Stock", description: "Curated box of gourmet organic vegetables.", createdAt: new Date().toISOString() },
                { id: "15", name: "Whole Organic Salmon", price: 85.00, imageUrl: "assets/img/product/big-product3.jpg", status: "Low Stock", description: "Freshly caught whole organic salmon.", createdAt: new Date().toISOString() },
                { id: "16", name: "Artisan Bread Pack", price: 30.00, imageUrl: "assets/img/product/big-product4.jpg", status: "In Stock", description: "Assorted artisan breads and pastries.", createdAt: new Date().toISOString() }
            ];
            await blobService.saveProducts(products);
        }

        renderAll();
    } catch (error) {
        console.error("Cloud Connection Error:", error);
        productList.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="mdi mdi-cloud-off-outline display-4 text-danger mb-3"></i>
                <h3 class="text-danger">Cloud Storage Unavailable</h3>
                <p class="text-muted">The secure API bridge is still deploying or unreachable.</p>
                <div class="alert alert-info d-inline-block mt-3">
                    <strong>Note:</strong> Ensure you are testing on your Vercel URL: <code>https://brocelle.vercel.app</code>
                </div>
            </div>`;
    }
}

function renderAll() {
    productList.innerHTML = '';
    products.forEach((product) => {
        renderProduct(product.id, product);
    });
}

function renderProduct(id, product) {
    const col = document.createElement('div');
    col.className = 'col-xxl-3 col-xl-4 col-md-6 mb-4';
    
    const statusClass = product.status === 'In Stock' ? 'bg-success' : (product.status === 'Low Stock' ? 'bg-warning' : 'bg-danger');
    
    let imgPath = product.imageUrl;
    if (imgPath && !imgPath.startsWith('http')) {
        imgPath = '../' + imgPath; 
    }

    col.innerHTML = `
        <div class="card product-card h-100 border-0 shadow-sm">
            <div class="product-img-wrapper p-3">
                <img src="${imgPath}" class="product-img" alt="${product.name}" onerror="this.src='../assets/img/product/product1.png'">
                <span class="position-absolute top-0 end-0 m-2 badge ${statusClass}">${product.status}</span>
            </div>
            <div class="card-body pt-0">
                <h5 class="card-title mb-1 text-capitalize">${product.name}</h5>
                <p class="text-muted small mb-3 text-truncate-2">${product.description || 'Organic healthy product.'}</p>
                <div class="d-flex align-items-center justify-content-between">
                    <h4 class="text-primary mb-0">$${parseFloat(product.price).toFixed(2)}</h4>
                    <div class="btn-group">
                        <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${id}" data-price="${product.price}" data-status="${product.status}">
                            <i class="mdi mdi-pencil"></i>
                        </button>
                        <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${id}">
                            <i class="mdi mdi-trash-can"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    productList.appendChild(col);

    col.querySelector('.edit-btn').addEventListener('click', (e) => {
        const btn = e.currentTarget;
        document.getElementById('editId').value = btn.dataset.id;
        document.getElementById('editPrice').value = btn.dataset.price;
        document.getElementById('editStatus').value = btn.dataset.status;
        new bootstrap.Modal(document.getElementById('editProductModal')).show();
    });

    col.querySelector('.delete-btn').addEventListener('click', async (e) => {
        if (confirm('Are you sure you want to delete this product?')) {
            products = products.filter(p => p.id !== id);
            await blobService.saveProducts(products);
            renderAll();
        }
    });
}

// Add Product
if (addProductForm) {
    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const submitBtn = document.getElementById('saveProductBtn');
        const fileInput = document.getElementById('newImage');
        const file = fileInput.files[0];

        try {
            submitBtn.disabled = true;
            document.getElementById('uploadProgress').style.display = 'block';
            const progressBar = document.querySelector('#uploadProgress .progress-bar');
            progressBar.style.width = '30%';

            let imageUrl = 'assets/img/product/product1.png';

            if (file) {
                progressBar.style.width = '60%';
                const blob = await blobService.upload(file.name, file);
                imageUrl = blob.url;
                progressBar.style.width = '90%';
            }

            const newProduct = {
                id: Date.now().toString(),
                name: document.getElementById('newName').value,
                description: document.getElementById('newDesc').value,
                price: parseFloat(document.getElementById('newPrice').value),
                status: document.getElementById('newStatus').value,
                imageUrl: imageUrl,
                createdAt: new Date().toISOString()
            };

            products.unshift(newProduct);
            await blobService.saveProducts(products);
            
            addProductForm.reset();
            document.getElementById('uploadProgress').style.display = 'none';
            bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
            renderAll();
        } catch (error) {
            console.error("Error adding product:", error);
            alert("Upload Error: " + error.message);
        } finally {
            submitBtn.disabled = false;
        }
    });
}

// Edit Product
if (editProductForm) {
    editProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('editId').value;
        const price = document.getElementById('editPrice').value;
        const status = document.getElementById('editStatus').value;

        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index].price = parseFloat(price);
            products[index].status = status;
            
            await blobService.saveProducts(products);
            bootstrap.Modal.getInstance(document.getElementById('editProductModal')).hide();
            renderAll();
        }
    });
}
