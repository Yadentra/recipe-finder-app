async function searchRecipes() {
    const query = document.getElementById("search").value;
    const apiKey = "69a94256bfc943448be480751698bc50"; // Your API key
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`;

    if (!query) {
        alert("Please enter a search term.");
        return; // Prevent searching if the input is empty
    }

    try {
        const response = await fetch(apiUrl);
        
        // Check if response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const recipes = data.results;

        // Check if recipes were found
        if (recipes.length === 0) {
            document.getElementById("recipe-list").innerHTML = "<p>No recipes found.</p>";
            return;
        }

        // Fetch details for each recipe
        const recipeDetailsPromises = recipes.map(recipe => fetchRecipeDetails(recipe.id, apiKey));
        const recipesWithDetails = await Promise.all(recipeDetailsPromises);

        displayRecipes(recipesWithDetails);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        document.getElementById("recipe-list").innerHTML = "<p>Error fetching recipes. Please try again later.</p>";
    }
}

async function fetchRecipeDetails(recipeId, apiKey) {
    const detailsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
    const response = await fetch(detailsUrl);

    // Check if response is ok
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

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
