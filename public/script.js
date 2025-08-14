class ProductExpirationMonitor {
    constructor() {
        this.products = [];
        this.filteredProducts = [];
        this.currentFilter = 'all';
        this.editingProductId = null;
        this.alertHistory = [];
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.loadProducts();
        this.updateStatus();
        this.loadAlertHistory();
        
        // Set minimum date to today for expiration date input
        const today = new Date().toISOString().split('T')[0];
        document.getElementById('expirationDate').min = today;
    }

    bindEvents() {
        // Search functionality
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.filterProducts();
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.filterProducts();
            });
        });

        // Add product button
        document.getElementById('addProductBtn').addEventListener('click', () => {
            this.openProductModal();
        });

        // Modal events
        document.getElementById('closeModal').addEventListener('click', () => {
            this.closeProductModal();
        });

        document.getElementById('cancelBtn').addEventListener('click', () => {
            this.closeProductModal();
        });

        document.getElementById('closeDeleteModal').addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('cancelDeleteBtn').addEventListener('click', () => {
            this.closeDeleteModal();
        });

        document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
            this.confirmDelete();
        });

        // Form submission
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });

        // Close modal when clicking outside
        document.getElementById('productModal').addEventListener('click', (e) => {
            if (e.target.id === 'productModal') {
                this.closeProductModal();
            }
        });

        document.getElementById('deleteModal').addEventListener('click', (e) => {
            if (e.target.id === 'deleteModal') {
                this.closeDeleteModal();
            }
        });

        // Add recipe button click handlers (will be bound dynamically)
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('recipe-btn')) {
                const productName = e.target.dataset.product;
                this.showRecipes(productName);
            }
        });
    }

    async loadProducts() {
        try {
            this.showLoading(true);
            const response = await fetch('/api/products');
            const data = await response.json();
            
            if (data.success) {
                this.products = data.data;
                this.filterProducts();
                this.updateSummaryCards();
                this.updateStatus('Connected', true);
            } else {
                throw new Error(data.error || 'Failed to load products');
            }
        } catch (error) {
            console.error('Error loading products:', error);
            this.showToast('Failed to load products', 'error');
            this.updateStatus('Connection Error', false);
        } finally {
            this.showLoading(false);
        }
    }

    filterProducts() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        
        let filtered = this.products.filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchTerm) ||
                                product.category.toLowerCase().includes(searchTerm);
            
            if (!matchesSearch) return false;
            
            const daysLeft = this.getDaysUntilExpiration(product.expiration_date);
            
            switch (this.currentFilter) {
                case 'tomorrow':
                    return daysLeft === 1;
                case 'week':
                    return daysLeft >= 0 && daysLeft <= 7;
                case 'expired':
                    return daysLeft < 0;
                case 'all':
                default:
                    return true;
            }
        });

        this.filteredProducts = filtered;
        this.renderProducts();
    }

    renderProducts() {
        const tbody = document.getElementById('productsTableBody');
        const emptyState = document.getElementById('emptyState');
        
        if (this.filteredProducts.length === 0) {
            tbody.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }
        
        emptyState.style.display = 'none';
        
        tbody.innerHTML = this.filteredProducts.map(product => {
            const daysLeft = this.getDaysUntilExpiration(product.expiration_date);
            const status = this.getExpirationStatus(daysLeft);
            
            return `
                <tr>
                    <td>
                        <strong>${this.escapeHtml(product.name)}</strong>
                    </td>
                    <td>${this.escapeHtml(product.category)}</td>
                    <td>${this.formatDate(product.expiration_date)}</td>
                    <td>
                        <span class="days-left ${daysLeft < 0 ? 'expired' : daysLeft <= 1 ? 'urgent' : daysLeft <= 7 ? 'warning' : 'good'}">
                            ${daysLeft < 0 ? `${Math.abs(daysLeft)} days ago` : daysLeft === 0 ? 'Today' : `${daysLeft} days`}
                        </span>
                    </td>
                    <td>${product.quantity}</td>
                    <td>$${parseFloat(product.price).toFixed(2)}</td>
                    <td>
                        <span class="status-badge ${status.class}">${status.text}</span>
                    </td>
                    <td>
                        <div class="action-buttons">
                            ${daysLeft <= 7 ? `<button class="action-btn recipe-btn" data-product="${this.escapeHtml(product.name)}" title="Get Recipes">
                                <i class="fas fa-utensils"></i>
                            </button>` : ''}
                            <button class="action-btn edit-btn" onclick="monitor.editProduct(${product.id})" title="Edit">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="action-btn delete-btn" onclick="monitor.deleteProduct(${product.id}, '${this.escapeHtml(product.name)}')" title="Delete">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
    }

    updateSummaryCards() {
        const tomorrow = this.products.filter(p => this.getDaysUntilExpiration(p.expiration_date) === 1).length;
        const week = this.products.filter(p => {
            const days = this.getDaysUntilExpiration(p.expiration_date);
            return days >= 0 && days <= 7;
        }).length;
        const total = this.products.length;

        document.getElementById('tomorrowCount').textContent = tomorrow;
        document.getElementById('weekCount').textContent = week;
        document.getElementById('totalCount').textContent = total;
    }

    async loadAlertHistory() {
        try {
            const response = await fetch('/api/alerts/history?limit=5');
            const data = await response.json();
            
            if (data.success) {
                this.alertHistory = data.data;
                // You could display this in a sidebar or modal if needed
            }
        } catch (error) {
            console.error('Error loading alert history:', error);
        }
    }

    async showRecipes(productName) {
        try {
            const response = await fetch(`/api/recipes/${encodeURIComponent(productName)}`);
            const data = await response.json();
            
            if (data.success && data.data.length > 0) {
                this.displayRecipeModal(productName, data.data);
            } else {
                this.showToast(`No recipes found for ${productName}`, 'info');
            }
        } catch (error) {
            console.error('Error fetching recipes:', error);
            this.showToast('Failed to load recipes', 'error');
        }
    }

    displayRecipeModal(productName, recipes) {
        // Create recipe modal if it doesn't exist
        let recipeModal = document.getElementById('recipeModal');
        if (!recipeModal) {
            recipeModal = document.createElement('div');
            recipeModal.id = 'recipeModal';
            recipeModal.className = 'modal';
            recipeModal.innerHTML = `
                <div class="modal-content">
                    <div class="modal-header">
                        <h2 id="recipeModalTitle">Recipe Suggestions</h2>
                        <button class="close-btn" id="closeRecipeModal">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <div class="modal-body" id="recipeModalBody">
                        <!-- Recipes will be loaded here -->
                    </div>
                </div>
            `;
            document.body.appendChild(recipeModal);
            
            // Bind close events
            document.getElementById('closeRecipeModal').addEventListener('click', () => {
                recipeModal.classList.remove('show');
            });
            
            recipeModal.addEventListener('click', (e) => {
                if (e.target.id === 'recipeModal') {
                    recipeModal.classList.remove('show');
                }
            });
        }
        
        // Update modal content
        document.getElementById('recipeModalTitle').textContent = `🍳 Recipe Suggestions for ${productName}`;
        
        const recipesHTML = recipes.map(recipe => `
            <div class="recipe-card">
                <div class="recipe-header">
                    <h3>${recipe.name}</h3>
                    <div class="recipe-meta">
                        <span class="recipe-time">⏱️ ${recipe.cookTime}</span>
                        <span class="recipe-difficulty">📊 ${recipe.difficulty}</span>
                    </div>
                </div>
                <p class="recipe-description">${recipe.description}</p>
                <div class="recipe-ingredients">
                    <strong>Ingredients:</strong>
                    <div class="ingredients-list">
                        ${recipe.ingredients.map(ingredient => `<span class="ingredient-tag">${ingredient}</span>`).join('')}
                    </div>
                </div>
            </div>
        `).join('');
        
        document.getElementById('recipeModalBody').innerHTML = recipesHTML;
        recipeModal.classList.add('show');
    }

    getDaysUntilExpiration(expirationDate) {
        const today = new Date();
        const expiry = new Date(expirationDate);
        const diffTime = expiry - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    getExpirationStatus(daysLeft) {
        if (daysLeft < 0) {
            return { class: 'status-expired', text: 'Expired' };
        } else if (daysLeft === 0) {
            return { class: 'status-tomorrow', text: 'Today' };
        } else if (daysLeft === 1) {
            return { class: 'status-tomorrow', text: 'Tomorrow' };
        } else if (daysLeft <= 7) {
            return { class: 'status-week', text: 'This Week' };
        } else {
            return { class: 'status-good', text: 'Good' };
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }

    openProductModal(product = null) {
        const modal = document.getElementById('productModal');
        const title = document.getElementById('modalTitle');
        const submitBtn = document.getElementById('submitBtn');
        
        if (product) {
            title.textContent = 'Edit Product';
            submitBtn.textContent = 'Update Product';
            this.editingProductId = product.id;
            
            // Fill form with product data
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('expirationDate').value = product.expiration_date;
            document.getElementById('quantity').value = product.quantity;
            document.getElementById('price').value = product.price;
        } else {
            title.textContent = 'Add New Product';
            submitBtn.textContent = 'Add Product';
            this.editingProductId = null;
            document.getElementById('productForm').reset();
        }
        
        modal.classList.add('show');
        document.getElementById('productName').focus();
    }

    closeProductModal() {
        const modal = document.getElementById('productModal');
        modal.classList.remove('show');
        this.editingProductId = null;
        document.getElementById('productForm').reset();
    }

    async saveProduct() {
        const formData = {
            name: document.getElementById('productName').value.trim(),
            category: document.getElementById('productCategory').value,
            expiration_date: document.getElementById('expirationDate').value,
            quantity: parseInt(document.getElementById('quantity').value),
            price: parseFloat(document.getElementById('price').value)
        };

        // Validation
        if (!formData.name || !formData.category || !formData.expiration_date || !formData.quantity || !formData.price) {
            this.showToast('Please fill in all fields', 'error');
            return;
        }

        if (formData.quantity < 1) {
            this.showToast('Quantity must be at least 1', 'error');
            return;
        }

        if (formData.price < 0) {
            this.showToast('Price cannot be negative', 'error');
            return;
        }

        try {
            const url = this.editingProductId 
                ? `/api/products/${this.editingProductId}` 
                : '/api/products';
            
            const method = this.editingProductId ? 'PUT' : 'POST';
            
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                this.showToast(
                    this.editingProductId ? 'Product updated successfully' : 'Product added successfully',
                    'success'
                );
                this.closeProductModal();
                this.loadProducts();
            } else {
                throw new Error(data.error || 'Failed to save product');
            }
        } catch (error) {
            console.error('Error saving product:', error);
            this.showToast('Failed to save product', 'error');
        }
    }

    editProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            this.openProductModal(product);
        }
    }

    deleteProduct(id, name) {
        this.deleteProductId = id;
        document.getElementById('deleteProductName').textContent = name;
        document.getElementById('deleteModal').classList.add('show');
    }

    closeDeleteModal() {
        document.getElementById('deleteModal').classList.remove('show');
        this.deleteProductId = null;
    }

    async confirmDelete() {
        if (!this.deleteProductId) return;

        try {
            const response = await fetch(`/api/products/${this.deleteProductId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                this.showToast('Product deleted successfully', 'success');
                this.closeDeleteModal();
                this.loadProducts();
            } else {
                throw new Error(data.error || 'Failed to delete product');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            this.showToast('Failed to delete product', 'error');
        }
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        const table = document.querySelector('.table-container');
        
        if (show) {
            loading.style.display = 'block';
            table.style.display = 'none';
        } else {
            loading.style.display = 'none';
            table.style.display = 'block';
        }
    }

    updateStatus(text, isConnected) {
        const statusText = document.getElementById('statusText');
        const statusDot = document.getElementById('statusDot');
        
        statusText.textContent = text;
        statusDot.style.background = isConnected ? '#48bb78' : '#f56565';
    }

    showToast(message, type = 'info') {
        const container = document.getElementById('toastContainer');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icon = type === 'success' ? 'fa-check-circle' : 
                    type === 'error' ? 'fa-exclamation-circle' : 
                    'fa-info-circle';
        
        toast.innerHTML = `
            <i class="fas ${icon}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 5000);
        
        // Remove on click
        toast.addEventListener('click', () => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        });
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    async triggerManualAlertCheck() {
        try {
            const response = await fetch('/api/alerts/check', { method: 'POST' });
            const data = await response.json();
            
            if (data.success) {
                this.showToast(`Manual alert check completed. ${data.totalAlerts} alert(s) sent.`, 'success');
                this.loadAlertHistory();
            } else {
                throw new Error(data.error || 'Failed to run alert check');
            }
        } catch (error) {
            console.error('Error running manual alert check:', error);
            this.showToast('Failed to run alert check', 'error');
        }
    }
}

// Initialize the application
const monitor = new ProductExpirationMonitor();

// Auto-refresh data every 30 seconds
setInterval(() => {
    monitor.loadProducts();
    monitor.loadAlertHistory();
}, 30000);