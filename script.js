async function searchRecipes() {
    const query = document.getElementById("search").value;
    const apiKey = "69a94256bfc943448be480751698bc50"; // Your new API key
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`;

    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`); // Capture HTTP errors
        }

        const data = await response.json();
        const recipes = data.results;

        if (recipes.length === 0) {
            document.getElementById("recipe-list").innerHTML = "<p>No recipes found.</p>";
            return;
        }

        const recipeDetailsPromises = recipes.map(recipe => fetchRecipeDetails(recipe.id, apiKey));
        const recipesWithDetails = await Promise.all(recipeDetailsPromises);

        displayRecipes(recipesWithDetails);
    } catch (error) {
        console.error("Error fetching recipes:", error); // Log error details
        document.getElementById("recipe-list").innerHTML = `<p>Error fetching recipes: ${error.message}. Please try again later.</p>`;
    }
}

async function fetchRecipeDetails(recipeId, apiKey) {
    const detailsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;
    const response = await fetch(detailsUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`); // Capture HTTP errors
    }
    return await response.json();
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById("recipe-list");
    recipeList.innerHTML = "";

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");

        recipeDiv.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" onclick="showRecipeDetails(${recipe.id})">
            <h3>${recipe.title}</h3>
        `;
        recipeList.appendChild(recipeDiv);
    });
}

async function showRecipeDetails(recipeId) {
    const apiKey = "088c4ff540064288a1f74e2891dbbeb4"; // Your new API key
    const detailsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    try {
        const response = await fetch(detailsUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const recipe = await response.json();
        const recipeDetails = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <h4>Ingredients:</h4>
            <ul class="ingredients">
                ${recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('')}
            </ul>
            <h4>Instructions:</h4>
            <p>${recipe.instructions}</p>
        `;

        const recipeList = document.getElementById("recipe-list");
        recipeList.innerHTML = recipeDetails; // Display recipe details in the same area
    } catch (error) {
        console.error("Error fetching recipe details:", error);
    }
}
