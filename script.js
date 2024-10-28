async function searchRecipes() {
    const query = document.getElementById("search").value;
    const apiKey = "69a94256bfc943448be480751698bc50"; // Your API key
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        const recipes = data.results;
        
        // Fetch details for each recipe
        const recipeDetailsPromises = recipes.map(recipe => fetchRecipeDetails(recipe.id, apiKey));
        const recipesWithDetails = await Promise.all(recipeDetailsPromises);

        displayRecipes(recipesWithDetails);
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

async function fetchRecipeDetails(recipeId, apiKey) {
    const detailsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
    const response = await fetch(detailsUrl);
    return await response.json(); // Returns detailed recipe information including ingredients
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById("recipe-list");
    recipeList.innerHTML = "";

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");

        // Extract ingredients
        const ingredients = recipe.extendedIngredients.map(ingredient => ingredient.original).join(', ');

        recipeDiv.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
            <p><strong>Ingredients:</strong> ${ingredients}</p>
        `;
        recipeList.appendChild(recipeDiv);
    });
}
