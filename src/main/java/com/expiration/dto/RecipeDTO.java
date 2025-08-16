package com.expiration.dto;

import java.util.List;

public class RecipeDTO {
    private String name;
    private String description;
    private List<String> ingredients;
    private String cookTime;
    private String difficulty;
    private String forProduct;
    
    // Constructors
    public RecipeDTO() {}
    
    public RecipeDTO(String name, String description, List<String> ingredients, 
                     String cookTime, String difficulty) {
        this.name = name;
        this.description = description;
        this.ingredients = ingredients;
        this.cookTime = cookTime;
        this.difficulty = difficulty;
    }
    
    public RecipeDTO(String name, String description, List<String> ingredients, 
                     String cookTime, String difficulty, String forProduct) {
        this.name = name;
        this.description = description;
        this.ingredients = ingredients;
        this.cookTime = cookTime;
        this.difficulty = difficulty;
        this.forProduct = forProduct;
    }
    
    // Getters and Setters
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public List<String> getIngredients() {
        return ingredients;
    }
    
    public void setIngredients(List<String> ingredients) {
        this.ingredients = ingredients;
    }
    
    public String getCookTime() {
        return cookTime;
    }
    
    public void setCookTime(String cookTime) {
        this.cookTime = cookTime;
    }
    
    public String getDifficulty() {
        return difficulty;
    }
    
    public void setDifficulty(String difficulty) {
        this.difficulty = difficulty;
    }
    
    public String getForProduct() {
        return forProduct;
    }
    
    public void setForProduct(String forProduct) {
        this.forProduct = forProduct;
    }
}