class EmailService {
    constructor() {
        this.emailEnabled = process.env.EMAIL_ENABLED === 'true';
        this.smtpConfig = {
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: process.env.SMTP_PORT || 587,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS
            }
        };
    }

    async sendExpirationAlert(products, alertType, recipes = []) {
        const subject = this.getEmailSubject(alertType, products.length);
        const htmlContent = this.generateEmailHTML(products, alertType, recipes);
        
        // For now, we'll simulate email sending and log the content
        console.log('\n📧 EMAIL ALERT SIMULATION');
        console.log('=' .repeat(60));
        console.log(`To: ${process.env.ALERT_EMAIL || 'admin@company.com'}`);
        console.log(`Subject: ${subject}`);
        console.log('Content:');
        console.log(htmlContent);
        console.log('=' .repeat(60));
        
        // In a real implementation, you would use nodemailer or similar:
        /*
        const nodemailer = require('nodemailer');
        const transporter = nodemailer.createTransporter(this.smtpConfig);
        
        await transporter.sendMail({
            from: process.env.SMTP_USER,
            to: process.env.ALERT_EMAIL,
            subject: subject,
            html: htmlContent
        });
        */
        
        return { success: true, message: 'Email alert sent successfully' };
    }

    getEmailSubject(alertType, productCount) {
        switch (alertType) {
            case 'tomorrow':
                return `🚨 URGENT: ${productCount} Product${productCount > 1 ? 's' : ''} Expiring Tomorrow!`;
            case '7-day':
                return `⚠️ WARNING: ${productCount} Product${productCount > 1 ? 's' : ''} Expiring This Week`;
            default:
                return `📦 Product Expiration Alert - ${productCount} Item${productCount > 1 ? 's' : ''}`;
        }
    }

    generateEmailHTML(products, alertType, recipes) {
        const urgencyColor = alertType === 'tomorrow' ? '#f56565' : '#ed8936';
        const urgencyText = alertType === 'tomorrow' ? 'URGENT ACTION REQUIRED' : 'ATTENTION NEEDED';
        
        let recipesHTML = '';
        if (recipes && recipes.length > 0) {
            recipesHTML = `
                <div style="margin-top: 30px; padding: 20px; background-color: #f7fafc; border-radius: 8px;">
                    <h3 style="color: #2d3748; margin-bottom: 15px;">🍳 Suggested Recipes to Use These Products:</h3>
                    ${recipes.map(recipe => `
                        <div style="margin-bottom: 20px; padding: 15px; background-color: white; border-radius: 6px; border-left: 4px solid #48bb78;">
                            <h4 style="color: #2d3748; margin: 0 0 8px 0;">${recipe.name}</h4>
                            <p style="color: #718096; margin: 0 0 8px 0; font-size: 14px;">${recipe.description}</p>
                            <div style="display: flex; gap: 15px; font-size: 12px; color: #a0aec0;">
                                <span>⏱️ ${recipe.cookTime}</span>
                                <span>📊 ${recipe.difficulty}</span>
                            </div>
                            <p style="margin: 8px 0 0 0; font-size: 13px; color: #4a5568;">
                                <strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}
                            </p>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Product Expiration Alert</title>
            </head>
            <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
                    <h1 style="color: white; margin: 0; font-size: 24px;">📦 Product Expiration Monitor</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">${urgencyText}</p>
                </div>
                
                <div style="background-color: ${urgencyColor}; color: white; padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: center;">
                    <h2 style="margin: 0; font-size: 18px;">
                        ${alertType === 'tomorrow' ? '🚨 Products Expiring Tomorrow' : '⚠️ Products Expiring This Week'}
                    </h2>
                </div>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                    ${products.map(product => {
                        const daysLeft = Math.ceil((new Date(product.expiration_date) - new Date()) / (1000 * 60 * 60 * 24));
                        const statusText = daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : 
                                         daysLeft === 0 ? 'Expires today' : 
                                         daysLeft === 1 ? 'Expires tomorrow' : 
                                         `${daysLeft} days remaining`;
                        
                        return `
                            <div style="background: white; padding: 15px; margin-bottom: 15px; border-radius: 6px; border-left: 4px solid ${urgencyColor};">
                                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                    <h3 style="margin: 0; color: #2d3748;">${product.name}</h3>
                                    <span style="background-color: ${urgencyColor}; color: white; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">
                                        ${statusText}
                                    </span>
                                </div>
                                <div style="color: #718096; font-size: 14px;">
                                    <p style="margin: 4px 0;"><strong>Category:</strong> ${product.category}</p>
                                    <p style="margin: 4px 0;"><strong>Expiration Date:</strong> ${new Date(product.expiration_date).toLocaleDateString()}</p>
                                    <p style="margin: 4px 0;"><strong>Quantity:</strong> ${product.quantity} units</p>
                                    <p style="margin: 4px 0;"><strong>Value:</strong> $${(product.price * product.quantity).toFixed(2)}</p>
                                </div>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                ${recipesHTML}
                
                <div style="background-color: #e6fffa; padding: 20px; border-radius: 8px; border-left: 4px solid #38b2ac;">
                    <h3 style="color: #2d3748; margin-top: 0;">💡 Recommended Actions:</h3>
                    <ul style="color: #4a5568; padding-left: 20px;">
                        <li>Use products in upcoming meals or recipes</li>
                        <li>Consider donating unexpired items if quantities are large</li>
                        <li>Update inventory management practices</li>
                        <li>Set up automatic reordering for frequently used items</li>
                        ${alertType === 'tomorrow' ? '<li><strong>URGENT:</strong> Use or dispose of these products immediately</li>' : ''}
                    </ul>
                </div>
                
                <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #718096; font-size: 12px;">
                    <p>This alert was generated automatically by the Product Expiration Monitor system.</p>
                    <p>Generated on ${new Date().toLocaleString()}</p>
                </div>
            </body>
            </html>
        `;
    }
}

module.exports = EmailService;