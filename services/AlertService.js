const EmailService = require('./EmailService');
const RecipeService = require('./RecipeService');

class AlertService {
    constructor() {
        this.emailService = new EmailService();
        this.recipeService = new RecipeService();
        this.alertHistory = [];
    }

    async sendExpirationAlert(products, alertType) {
        if (products.length === 0) {
            console.log(`ℹ️  No products found for ${alertType} alert`);
            return;
        }

        // Get recipe suggestions for expiring products
        const recipeSuggestions = this.getRecipeSuggestions(products);
        
        // Log console alert with enhanced formatting
        this.logConsoleAlert(products, alertType, recipeSuggestions);
        
        // Send email alert (simulated)
        try {
            await this.emailService.sendExpirationAlert(products, alertType, recipeSuggestions);
        } catch (error) {
            console.error('❌ Failed to send email alert:', error.message);
        }
        
        // Store alert in history
        this.storeAlertHistory(products, alertType, recipeSuggestions);
        
        return {
            success: true,
            alertType,
            productCount: products.length,
            recipes: recipeSuggestions
        };
    }

    getRecipeSuggestions(products) {
        const allRecipes = [];
        const seenRecipes = new Set();
        
        products.forEach(product => {
            const recipes = this.recipeService.getRecipesForProduct(product.name);
            recipes.forEach(recipe => {
                if (!seenRecipes.has(recipe.name)) {
                    seenRecipes.add(recipe.name);
                    allRecipes.push({
                        ...recipe,
                        forProduct: product.name
                    });
                }
            });
        });
        
        // Limit to top 5 recipes to avoid overwhelming
        return allRecipes.slice(0, 5);
    }

    logConsoleAlert(products, alertType, recipes) {
        const alertEmoji = alertType === 'tomorrow' ? '🚨' : '⚠️';
        const alertLevel = alertType === 'tomorrow' ? 'URGENT' : 'WARNING';
        const alertColor = alertType === 'tomorrow' ? '\x1b[31m' : '\x1b[33m'; // Red or Yellow
        const resetColor = '\x1b[0m';
        
        console.log(`\n${alertEmoji} ${alertColor}${alertLevel} EXPIRATION ALERT${resetColor}`);
        console.log('=' .repeat(80));
        console.log(`📊 Found ${products.length} product(s) ${alertType === 'tomorrow' ? 'expiring tomorrow' : 'expiring within 7 days'}`);
        console.log(`💰 Total value at risk: $${this.calculateTotalValue(products).toFixed(2)}`);
        console.log('');
        
        // Product details
        console.log('📦 AFFECTED PRODUCTS:');
        console.log('-' .repeat(80));
        
        products.forEach((product, index) => {
            const daysLeft = Math.ceil((new Date(product.expiration_date) - new Date()) / (1000 * 60 * 60 * 24));
            const statusEmoji = daysLeft < 0 ? '💀' : daysLeft === 0 ? '🔴' : daysLeft === 1 ? '🟠' : '🟡';
            const totalValue = (product.price * product.quantity).toFixed(2);
            
            console.log(`${index + 1}. ${statusEmoji} ${product.name} (${product.category})`);
            console.log(`   📅 Expires: ${product.expiration_date} (${daysLeft} day${daysLeft !== 1 ? 's' : ''})`);
            console.log(`   📦 Quantity: ${product.quantity} units | 💵 Value: $${totalValue}`);
            console.log('');
        });
        
        // Recipe suggestions
        if (recipes && recipes.length > 0) {
            console.log('🍳 RECIPE SUGGESTIONS:');
            console.log('-' .repeat(80));
            
            recipes.forEach((recipe, index) => {
                console.log(`${index + 1}. ${recipe.name} (${recipe.difficulty}) - ${recipe.cookTime}`);
                console.log(`   📝 ${recipe.description}`);
                console.log(`   🥘 For: ${recipe.forProduct}`);
                console.log(`   🛒 Ingredients: ${recipe.ingredients.join(', ')}`);
                console.log('');
            });
        }
        
        // Action recommendations
        console.log('💡 RECOMMENDED ACTIONS:');
        console.log('-' .repeat(80));
        if (alertType === 'tomorrow') {
            console.log('🔥 IMMEDIATE ACTION REQUIRED:');
            console.log('   • Use products in today\'s meals');
            console.log('   • Prepare recipes using these ingredients');
            console.log('   • Consider donating if quantities are large');
            console.log('   • Remove expired items from inventory');
        } else {
            console.log('📋 PLAN AHEAD:');
            console.log('   • Schedule meals using these products');
            console.log('   • Check if products can be frozen');
            console.log('   • Consider bulk cooking and meal prep');
            console.log('   • Review ordering patterns to reduce waste');
        }
        
        console.log('=' .repeat(80));
        console.log(`⏰ Alert generated at: ${new Date().toLocaleString()}`);
        console.log('');
    }

    calculateTotalValue(products) {
        return products.reduce((total, product) => {
            return total + (product.price * product.quantity);
        }, 0);
    }

    storeAlertHistory(products, alertType, recipes) {
        const alert = {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            type: alertType,
            productCount: products.length,
            totalValue: this.calculateTotalValue(products),
            products: products.map(p => ({
                id: p.id,
                name: p.name,
                category: p.category,
                expiration_date: p.expiration_date,
                quantity: p.quantity,
                price: p.price
            })),
            recipes: recipes,
            status: 'sent'
        };
        
        this.alertHistory.push(alert);
        
        // Keep only last 100 alerts to prevent memory issues
        if (this.alertHistory.length > 100) {
            this.alertHistory = this.alertHistory.slice(-100);
        }
    }

    getAlertHistory(limit = 10) {
        return this.alertHistory
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .slice(0, limit);
    }

    getAlertStats() {
        const now = new Date();
        const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000);
        const last7Days = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        
        const recent24h = this.alertHistory.filter(alert => new Date(alert.timestamp) > last24Hours);
        const recent7d = this.alertHistory.filter(alert => new Date(alert.timestamp) > last7Days);
        
        return {
            total: this.alertHistory.length,
            last24Hours: recent24h.length,
            last7Days: recent7d.length,
            totalValueAtRisk24h: recent24h.reduce((sum, alert) => sum + alert.totalValue, 0),
            totalValueAtRisk7d: recent7d.reduce((sum, alert) => sum + alert.totalValue, 0)
        };
    }
}

module.exports = AlertService;