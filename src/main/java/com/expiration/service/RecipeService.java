package com.expiration.service;

import com.expiration.dto.RecipeDTO;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class RecipeService {
    
    private final Map<String, List<RecipeDTO>> recipeDatabase;
    
    public RecipeService() {
        this.recipeDatabase = initializeRecipeDatabase();
    }
    
    /**
     * Get recipe suggestions for a specific product
     */
    public List<RecipeDTO> getRecipesForProduct(String productName) {
        String normalizedName = productName.toLowerCase().trim();
        
        // Direct match
        List<RecipeDTO> directMatch = recipeDatabase.get(normalizedName);
        if (directMatch != null && !directMatch.isEmpty()) {
            return directMatch.stream()
                    .map(recipe -> {
                        RecipeDTO dto = new RecipeDTO(recipe.getName(), recipe.getDescription(), 
                                                    recipe.getIngredients(), recipe.getCookTime(), 
                                                    recipe.getDifficulty());
                        dto.setForProduct(productName);
                        return dto;
                    })
                    .collect(Collectors.toList());
        }
        
        // Partial match
        for (Map.Entry<String, List<RecipeDTO>> entry : recipeDatabase.entrySet()) {
            if (normalizedName.contains(entry.getKey()) || entry.getKey().contains(normalizedName)) {
                return entry.getValue().stream()
                        .map(recipe -> {
                            RecipeDTO dto = new RecipeDTO(recipe.getName(), recipe.getDescription(), 
                                                        recipe.getIngredients(), recipe.getCookTime(), 
                                                        recipe.getDifficulty());
                            dto.setForProduct(productName);
                            return dto;
                        })
                        .collect(Collectors.toList());
            }
        }
        
        // Category-based suggestions
        List<RecipeDTO> categoryRecipes = getCategoryBasedRecipes(normalizedName);
        if (!categoryRecipes.isEmpty()) {
            return categoryRecipes.stream()
                    .map(recipe -> {
                        RecipeDTO dto = new RecipeDTO(recipe.getName(), recipe.getDescription(), 
                                                    recipe.getIngredients(), recipe.getCookTime(), 
                                                    recipe.getDifficulty());
                        dto.setForProduct(productName);
                        return dto;
                    })
                    .collect(Collectors.toList());
        }
        
        // Default generic recipes
        return getDefaultRecipes(productName);
    }
    
    /**
     * Get multiple recipe suggestions for a list of products
     */
    public List<RecipeDTO> getRecipesForProducts(List<String> productNames) {
        Set<String> uniqueRecipes = new HashSet<>();
        List<RecipeDTO> allRecipes = new ArrayList<>();
        
        for (String productName : productNames) {
            List<RecipeDTO> recipes = getRecipesForProduct(productName);
            for (RecipeDTO recipe : recipes) {
                if (uniqueRecipes.add(recipe.getName())) {
                    allRecipes.add(recipe);
                }
            }
        }
        
        // Limit to top 5 recipes to avoid overwhelming
        return allRecipes.stream().limit(5).collect(Collectors.toList());
    }
    
    private List<RecipeDTO> getCategoryBasedRecipes(String productName) {
        String[] meatKeywords = {"chicken", "beef", "pork", "meat", "turkey", "lamb"};
        String[] vegetableKeywords = {"lettuce", "tomato", "spinach", "pepper", "carrot", "onion", "broccoli"};
        String[] fruitKeywords = {"apple", "banana", "berry", "orange", "grape", "strawberry"};
        String[] dairyKeywords = {"milk", "cheese", "yogurt", "cream", "butter"};
        
        if (Arrays.stream(meatKeywords).anyMatch(productName::contains)) {
            return recipeDatabase.getOrDefault("chicken", new ArrayList<>());
        }
        
        if (Arrays.stream(vegetableKeywords).anyMatch(productName::contains)) {
            return recipeDatabase.getOrDefault("tomatoes", new ArrayList<>());
        }
        
        if (Arrays.stream(fruitKeywords).anyMatch(productName::contains)) {
            return recipeDatabase.getOrDefault("apples", new ArrayList<>());
        }
        
        if (Arrays.stream(dairyKeywords).anyMatch(productName::contains)) {
            return recipeDatabase.getOrDefault("milk", new ArrayList<>());
        }
        
        return new ArrayList<>();
    }
    
    private List<RecipeDTO> getDefaultRecipes(String productName) {
        return Arrays.asList(
                new RecipeDTO(
                        "Quick Stir Fry",
                        "Simple stir fry using " + productName,
                        Arrays.asList(productName.toLowerCase(), "vegetables", "oil", "seasonings"),
                        "15 minutes",
                        "Easy",
                        productName
                ),
                new RecipeDTO(
                        "Simple Soup",
                        "Comforting soup featuring " + productName,
                        Arrays.asList(productName.toLowerCase(), "broth", "vegetables", "herbs"),
                        "30 minutes",
                        "Easy",
                        productName
                )
        );
    }
    
    private Map<String, List<RecipeDTO>> initializeRecipeDatabase() {
        Map<String, List<RecipeDTO>> recipes = new HashMap<>();
        
        // Dairy recipes
        recipes.put("milk", Arrays.asList(
                new RecipeDTO("Creamy Pancakes", "Fluffy pancakes perfect for breakfast",
                        Arrays.asList("milk", "flour", "eggs", "sugar", "baking powder"), "20 minutes", "Easy"),
                new RecipeDTO("Milk Rice Pudding", "Comforting dessert with warm spices",
                        Arrays.asList("milk", "rice", "sugar", "vanilla", "cinnamon"), "45 minutes", "Easy"),
                new RecipeDTO("White Sauce Pasta", "Creamy pasta with rich white sauce",
                        Arrays.asList("milk", "pasta", "butter", "flour", "cheese"), "25 minutes", "Medium")
        ));
        
        recipes.put("cheese", Arrays.asList(
                new RecipeDTO("Cheese Quesadillas", "Quick and delicious Mexican-style quesadillas",
                        Arrays.asList("cheese", "tortillas", "onions", "peppers"), "15 minutes", "Easy"),
                new RecipeDTO("Mac and Cheese", "Classic comfort food with creamy cheese sauce",
                        Arrays.asList("cheese", "pasta", "milk", "butter", "flour"), "30 minutes", "Medium"),
                new RecipeDTO("Cheese Omelette", "Perfect breakfast with melted cheese",
                        Arrays.asList("cheese", "eggs", "butter", "herbs"), "10 minutes", "Easy")
        ));
        
        recipes.put("yogurt", Arrays.asList(
                new RecipeDTO("Yogurt Smoothie Bowl", "Healthy breakfast bowl with fresh toppings",
                        Arrays.asList("yogurt", "berries", "granola", "honey"), "5 minutes", "Easy"),
                new RecipeDTO("Yogurt Marinated Chicken", "Tender chicken with yogurt marinade",
                        Arrays.asList("yogurt", "chicken", "spices", "garlic", "lemon"), "45 minutes", "Medium")
        ));
        
        // Meat recipes
        recipes.put("chicken", Arrays.asList(
                new RecipeDTO("Chicken Stir Fry", "Quick and healthy stir-fry with fresh vegetables",
                        Arrays.asList("chicken", "vegetables", "soy sauce", "garlic", "ginger"), "20 minutes", "Easy"),
                new RecipeDTO("Chicken Curry", "Aromatic curry with rich coconut sauce",
                        Arrays.asList("chicken", "coconut milk", "curry powder", "onions", "tomatoes"), "40 minutes", "Medium"),
                new RecipeDTO("Grilled Chicken Salad", "Healthy salad with grilled chicken breast",
                        Arrays.asList("chicken", "lettuce", "tomatoes", "cucumber", "dressing"), "25 minutes", "Easy")
        ));
        
        recipes.put("beef", Arrays.asList(
                new RecipeDTO("Beef Tacos", "Classic tacos with seasoned ground beef",
                        Arrays.asList("ground beef", "taco shells", "lettuce", "cheese", "tomatoes"), "20 minutes", "Easy"),
                new RecipeDTO("Beef Stew", "Hearty stew perfect for cold days",
                        Arrays.asList("beef", "potatoes", "carrots", "onions", "broth"), "2 hours", "Medium")
        ));
        
        // Vegetable recipes
        recipes.put("tomatoes", Arrays.asList(
                new RecipeDTO("Caprese Salad", "Fresh Italian salad with ripe tomatoes",
                        Arrays.asList("tomatoes", "mozzarella", "basil", "olive oil"), "10 minutes", "Easy"),
                new RecipeDTO("Tomato Pasta Sauce", "Homemade pasta sauce with fresh tomatoes",
                        Arrays.asList("tomatoes", "garlic", "onions", "herbs", "olive oil"), "30 minutes", "Easy"),
                new RecipeDTO("Stuffed Tomatoes", "Baked tomatoes stuffed with savory filling",
                        Arrays.asList("tomatoes", "rice", "herbs", "cheese"), "45 minutes", "Medium")
        ));
        
        recipes.put("lettuce", Arrays.asList(
                new RecipeDTO("Caesar Salad", "Classic Caesar salad with crispy lettuce",
                        Arrays.asList("lettuce", "croutons", "parmesan", "caesar dressing"), "10 minutes", "Easy"),
                new RecipeDTO("Lettuce Wraps", "Healthy wraps using lettuce as shells",
                        Arrays.asList("lettuce", "ground meat", "vegetables", "sauce"), "15 minutes", "Easy")
        ));
        
        // Fruit recipes
        recipes.put("apples", Arrays.asList(
                new RecipeDTO("Apple Pie", "Classic American apple pie with flaky crust",
                        Arrays.asList("apples", "pie crust", "sugar", "cinnamon", "butter"), "1 hour", "Medium"),
                new RecipeDTO("Apple Crisp", "Warm dessert with crunchy oat topping",
                        Arrays.asList("apples", "oats", "brown sugar", "butter", "cinnamon"), "45 minutes", "Easy"),
                new RecipeDTO("Apple Sauce", "Homemade applesauce perfect as side or snack",
                        Arrays.asList("apples", "sugar", "cinnamon", "lemon juice"), "25 minutes", "Easy")
        ));
        
        recipes.put("bananas", Arrays.asList(
                new RecipeDTO("Banana Bread", "Moist banana bread perfect for overripe bananas",
                        Arrays.asList("bananas", "flour", "sugar", "eggs", "butter"), "1 hour", "Easy"),
                new RecipeDTO("Banana Smoothie", "Creamy smoothie with natural sweetness",
                        Arrays.asList("bananas", "milk", "honey", "ice"), "5 minutes", "Easy")
        ));
        
        // Bakery recipes
        recipes.put("bread", Arrays.asList(
                new RecipeDTO("French Toast", "Perfect breakfast using day-old bread",
                        Arrays.asList("bread", "eggs", "milk", "cinnamon", "vanilla"), "15 minutes", "Easy"),
                new RecipeDTO("Bread Pudding", "Comforting dessert that uses stale bread",
                        Arrays.asList("bread", "milk", "eggs", "sugar", "vanilla"), "45 minutes", "Easy")
        ));
        
        // Eggs
        recipes.put("eggs", Arrays.asList(
                new RecipeDTO("Scrambled Eggs", "Creamy scrambled eggs for any meal",
                        Arrays.asList("eggs", "butter", "milk", "salt", "pepper"), "5 minutes", "Easy"),
                new RecipeDTO("Egg Fried Rice", "Quick fried rice with scrambled eggs",
                        Arrays.asList("eggs", "rice", "vegetables", "soy sauce"), "15 minutes", "Easy")
        ));
        
        return recipes;
    }
}