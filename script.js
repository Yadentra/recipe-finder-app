async function searchRecipes() {
    const query = document.getElementById("search").value;
    const appId = "55b9bb9c"; // Your Edamam app ID
    const apiKey = "1f2603efa919c869538d09f497c677b6"; // Your Edamam API key
    const apiUrl = `https://api.edamam.com/search?q=${query}&app_id=${appId}&app_key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayRecipes(data.hits);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        alert("An error occurred while fetching recipes. Please try again.");
    }
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById("recipe-list");
    recipeList.innerHTML = "";

    recipes.forEach(recipeData => {
        const recipe = recipeData.recipe;
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");

        recipeDiv.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.label}" onclick="showIngredients('${recipe.uri}')">
            <h3>${recipe.label}</h3>
        `;
        recipeList.appendChild(recipeDiv);
    });
}

async function showIngredients(recipeUri) {
    const encodedUri = encodeURIComponent(recipeUri);
    const appId = "55b9bb9c";
    const apiKey = "1f2603efa919c869538d09f497c677b6";
    const apiUrl = `https://api.edamam.com/api/recipes/v2/${encodedUri}?type=public&app_id=${appId}&app_key=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const ingredients = data.recipe.ingredientLines;

        const ingredientsDiv = document.createElement("div");
        ingredientsDiv.classList.add("ingredients");
        ingredientsDiv.innerHTML = `
            <h4>Ingredients:</h4>
            <ul>${ingredients.map(item => `<li>${item}</li>`).join('')}</ul>
        `;

        const recipeList = document.getElementById("recipe-list");
        recipeList.appendChild(ingredientsDiv);
    } catch (error) {
        console.error("Error fetching ingredients:", error);
        alert("An error occurred while fetching ingredients. Please try again.");
    }
}
