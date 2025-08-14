class RecipeService {
    constructor() {
        this.recipes = {
            // Dairy recipes
            'milk': [
                {
                    name: 'Creamy Pancakes',
                    ingredients: ['milk', 'flour', 'eggs', 'sugar', 'baking powder'],
                    cookTime: '20 minutes',
                    difficulty: 'Easy',
                    description: 'Fluffy pancakes perfect for breakfast'
                },
                {
                    name: 'Milk Rice Pudding',
                    ingredients: ['milk', 'rice', 'sugar', 'vanilla', 'cinnamon'],
                    cookTime: '45 minutes',
                    difficulty: 'Easy',
                    description: 'Comforting dessert with warm spices'
                },
                {
                    name: 'White Sauce Pasta',
                    ingredients: ['milk', 'pasta', 'butter', 'flour', 'cheese'],
                    cookTime: '25 minutes',
                    difficulty: 'Medium',
                    description: 'Creamy pasta with rich white sauce'
                }
            ],
            'cheese': [
                {
                    name: 'Cheese Quesadillas',
                    ingredients: ['cheese', 'tortillas', 'onions', 'peppers'],
                    cookTime: '15 minutes',
                    difficulty: 'Easy',
                    description: 'Quick and delicious Mexican-style quesadillas'
                },
                {
                    name: 'Mac and Cheese',
                    ingredients: ['cheese', 'pasta', 'milk', 'butter', 'flour'],
                    cookTime: '30 minutes',
                    difficulty: 'Medium',
                    description: 'Classic comfort food with creamy cheese sauce'
                },
                {
                    name: 'Cheese Omelette',
                    ingredients: ['cheese', 'eggs', 'butter', 'herbs'],
                    cookTime: '10 minutes',
                    difficulty: 'Easy',
                    description: 'Perfect breakfast with melted cheese'
                }
            ],
            'yogurt': [
                {
                    name: 'Yogurt Smoothie Bowl',
                    ingredients: ['yogurt', 'berries', 'granola', 'honey'],
                    cookTime: '5 minutes',
                    difficulty: 'Easy',
                    description: 'Healthy breakfast bowl with fresh toppings'
                },
                {
                    name: 'Yogurt Marinated Chicken',
                    ingredients: ['yogurt', 'chicken', 'spices', 'garlic', 'lemon'],
                    cookTime: '45 minutes',
                    difficulty: 'Medium',
                    description: 'Tender chicken with yogurt marinade'
                }
            ],
            // Meat recipes
            'chicken': [
                {
                    name: 'Chicken Stir Fry',
                    ingredients: ['chicken', 'vegetables', 'soy sauce', 'garlic', 'ginger'],
                    cookTime: '20 minutes',
                    difficulty: 'Easy',
                    description: 'Quick and healthy stir-fry with fresh vegetables'
                },
                {
                    name: 'Chicken Curry',
                    ingredients: ['chicken', 'coconut milk', 'curry powder', 'onions', 'tomatoes'],
                    cookTime: '40 minutes',
                    difficulty: 'Medium',
                    description: 'Aromatic curry with rich coconut sauce'
                },
                {
                    name: 'Grilled Chicken Salad',
                    ingredients: ['chicken', 'lettuce', 'tomatoes', 'cucumber', 'dressing'],
                    cookTime: '25 minutes',
                    difficulty: 'Easy',
                    description: 'Healthy salad with grilled chicken breast'
                }
            ],
            'beef': [
                {
                    name: 'Beef Tacos',
                    ingredients: ['ground beef', 'taco shells', 'lettuce', 'cheese', 'tomatoes'],
                    cookTime: '20 minutes',
                    difficulty: 'Easy',
                    description: 'Classic tacos with seasoned ground beef'
                },
                {
                    name: 'Beef Stew',
                    ingredients: ['beef', 'potatoes', 'carrots', 'onions', 'broth'],
                    cookTime: '2 hours',
                    difficulty: 'Medium',
                    description: 'Hearty stew perfect for cold days'
                }
            ],
            'pork': [
                {
                    name: 'Pork Chop Dinner',
                    ingredients: ['pork chops', 'potatoes', 'green beans', 'herbs'],
                    cookTime: '35 minutes',
                    difficulty: 'Medium',
                    description: 'Complete dinner with juicy pork chops'
                }
            ],
            // Vegetable recipes
            'lettuce': [
                {
                    name: 'Caesar Salad',
                    ingredients: ['lettuce', 'croutons', 'parmesan', 'caesar dressing'],
                    cookTime: '10 minutes',
                    difficulty: 'Easy',
                    description: 'Classic Caesar salad with crispy lettuce'
                },
                {
                    name: 'Lettuce Wraps',
                    ingredients: ['lettuce', 'ground meat', 'vegetables', 'sauce'],
                    cookTime: '15 minutes',
                    difficulty: 'Easy',
                    description: 'Healthy wraps using lettuce as shells'
                }
            ],
            'tomatoes': [
                {
                    name: 'Caprese Salad',
                    ingredients: ['tomatoes', 'mozzarella', 'basil', 'olive oil'],
                    cookTime: '10 minutes',
                    difficulty: 'Easy',
                    description: 'Fresh Italian salad with ripe tomatoes'
                },
                {
                    name: 'Tomato Pasta Sauce',
                    ingredients: ['tomatoes', 'garlic', 'onions', 'herbs', 'olive oil'],
                    cookTime: '30 minutes',
                    difficulty: 'Easy',
                    description: 'Homemade pasta sauce with fresh tomatoes'
                },
                {
                    name: 'Stuffed Tomatoes',
                    ingredients: ['tomatoes', 'rice', 'herbs', 'cheese'],
                    cookTime: '45 minutes',
                    difficulty: 'Medium',
                    description: 'Baked tomatoes stuffed with savory filling'
                }
            ],
            'spinach': [
                {
                    name: 'Spinach Smoothie',
                    ingredients: ['spinach', 'banana', 'apple', 'yogurt'],
                    cookTime: '5 minutes',
                    difficulty: 'Easy',
                    description: 'Healthy green smoothie packed with nutrients'
                },
                {
                    name: 'Creamed Spinach',
                    ingredients: ['spinach', 'cream', 'garlic', 'nutmeg'],
                    cookTime: '15 minutes',
                    difficulty: 'Easy',
                    description: 'Classic side dish with rich cream sauce'
                }
            ],
            'bell peppers': [
                {
                    name: 'Stuffed Bell Peppers',
                    ingredients: ['bell peppers', 'ground meat', 'rice', 'cheese'],
                    cookTime: '45 minutes',
                    difficulty: 'Medium',
                    description: 'Colorful peppers stuffed with savory filling'
                }
            ],
            // Fruit recipes
            'apples': [
                {
                    name: 'Apple Pie',
                    ingredients: ['apples', 'pie crust', 'sugar', 'cinnamon', 'butter'],
                    cookTime: '1 hour',
                    difficulty: 'Medium',
                    description: 'Classic American apple pie with flaky crust'
                },
                {
                    name: 'Apple Crisp',
                    ingredients: ['apples', 'oats', 'brown sugar', 'butter', 'cinnamon'],
                    cookTime: '45 minutes',
                    difficulty: 'Easy',
                    description: 'Warm dessert with crunchy oat topping'
                },
                {
                    name: 'Apple Sauce',
                    ingredients: ['apples', 'sugar', 'cinnamon', 'lemon juice'],
                    cookTime: '25 minutes',
                    difficulty: 'Easy',
                    description: 'Homemade applesauce perfect as side or snack'
                }
            ],
            'bananas': [
                {
                    name: 'Banana Bread',
                    ingredients: ['bananas', 'flour', 'sugar', 'eggs', 'butter'],
                    cookTime: '1 hour',
                    difficulty: 'Easy',
                    description: 'Moist banana bread perfect for overripe bananas'
                },
                {
                    name: 'Banana Smoothie',
                    ingredients: ['bananas', 'milk', 'honey', 'ice'],
                    cookTime: '5 minutes',
                    difficulty: 'Easy',
                    description: 'Creamy smoothie with natural sweetness'
                },
                {
                    name: 'Banana Pancakes',
                    ingredients: ['bananas', 'eggs', 'flour', 'milk'],
                    cookTime: '15 minutes',
                    difficulty: 'Easy',
                    description: 'Fluffy pancakes with mashed banana'
                }
            ],
            'strawberries': [
                {
                    name: 'Strawberry Shortcake',
                    ingredients: ['strawberries', 'biscuits', 'whipped cream', 'sugar'],
                    cookTime: '30 minutes',
                    difficulty: 'Medium',
                    description: 'Classic dessert with fresh strawberries'
                },
                {
                    name: 'Strawberry Jam',
                    ingredients: ['strawberries', 'sugar', 'lemon juice'],
                    cookTime: '45 minutes',
                    difficulty: 'Medium',
                    description: 'Homemade jam to preserve fresh strawberries'
                }
            ],
            // Bakery recipes
            'bread': [
                {
                    name: 'French Toast',
                    ingredients: ['bread', 'eggs', 'milk', 'cinnamon', 'vanilla'],
                    cookTime: '15 minutes',
                    difficulty: 'Easy',
                    description: 'Perfect breakfast using day-old bread'
                },
                {
                    name: 'Bread Pudding',
                    ingredients: ['bread', 'milk', 'eggs', 'sugar', 'vanilla'],
                    cookTime: '45 minutes',
                    difficulty: 'Easy',
                    description: 'Comforting dessert that uses stale bread'
                },
                {
                    name: 'Croutons',
                    ingredients: ['bread', 'olive oil', 'herbs', 'garlic'],
                    cookTime: '20 minutes',
                    difficulty: 'Easy',
                    description: 'Crunchy bread cubes perfect for salads'
                }
            ],
            // Seafood recipes
            'salmon': [
                {
                    name: 'Grilled Salmon',
                    ingredients: ['salmon', 'lemon', 'herbs', 'olive oil'],
                    cookTime: '20 minutes',
                    difficulty: 'Easy',
                    description: 'Simple grilled salmon with fresh herbs'
                },
                {
                    name: 'Salmon Teriyaki',
                    ingredients: ['salmon', 'teriyaki sauce', 'rice', 'vegetables'],
                    cookTime: '25 minutes',
                    difficulty: 'Medium',
                    description: 'Asian-inspired salmon with sweet glaze'
                }
            ],
            // Eggs
            'eggs': [
                {
                    name: 'Scrambled Eggs',
                    ingredients: ['eggs', 'butter', 'milk', 'salt', 'pepper'],
                    cookTime: '5 minutes',
                    difficulty: 'Easy',
                    description: 'Creamy scrambled eggs for any meal'
                },
                {
                    name: 'Egg Fried Rice',
                    ingredients: ['eggs', 'rice', 'vegetables', 'soy sauce'],
                    cookTime: '15 minutes',
                    difficulty: 'Easy',
                    description: 'Quick fried rice with scrambled eggs'
                },
                {
                    name: 'Deviled Eggs',
                    ingredients: ['eggs', 'mayonnaise', 'mustard', 'paprika'],
                    cookTime: '20 minutes',
                    difficulty: 'Easy',
                    description: 'Classic appetizer perfect for parties'
                }
            ]
        };
    }

    getRecipesForProduct(productName) {
        const normalizedName = productName.toLowerCase();
        
        // Direct match
        if (this.recipes[normalizedName]) {
            return this.recipes[normalizedName];
        }
        
        // Partial match
        for (const [key, recipes] of Object.entries(this.recipes)) {
            if (normalizedName.includes(key) || key.includes(normalizedName)) {
                return recipes;
            }
        }
        
        // Category-based suggestions
        const categoryRecipes = this.getCategoryRecipes(normalizedName);
        if (categoryRecipes.length > 0) {
            return categoryRecipes;
        }
        
        // Default recipes for common ingredients
        return [
            {
                name: 'Quick Stir Fry',
                ingredients: [productName.toLowerCase(), 'vegetables', 'oil', 'seasonings'],
                cookTime: '15 minutes',
                difficulty: 'Easy',
                description: `Simple stir fry using ${productName}`
            },
            {
                name: 'Simple Soup',
                ingredients: [productName.toLowerCase(), 'broth', 'vegetables', 'herbs'],
                cookTime: '30 minutes',
                difficulty: 'Easy',
                description: `Comforting soup featuring ${productName}`
            }
        ];
    }

    getCategoryRecipes(productName) {
        const meatKeywords = ['chicken', 'beef', 'pork', 'meat', 'turkey'];
        const vegetableKeywords = ['lettuce', 'tomato', 'spinach', 'pepper', 'carrot', 'onion'];
        const fruitKeywords = ['apple', 'banana', 'berry', 'orange', 'grape'];
        const dairyKeywords = ['milk', 'cheese', 'yogurt', 'cream'];
        
        if (meatKeywords.some(keyword => productName.includes(keyword))) {
            return this.recipes['chicken'] || [];
        }
        
        if (vegetableKeywords.some(keyword => productName.includes(keyword))) {
            return this.recipes['tomatoes'] || [];
        }
        
        if (fruitKeywords.some(keyword => productName.includes(keyword))) {
            return this.recipes['apples'] || [];
        }
        
        if (dairyKeywords.some(keyword => productName.includes(keyword))) {
            return this.recipes['milk'] || [];
        }
        
        return [];
    }

    getRandomRecipes(count = 3) {
        const allRecipes = Object.values(this.recipes).flat();
        const shuffled = allRecipes.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
    }
}

module.exports = RecipeService;