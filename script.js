async function searchRecipes() {
    const query = document.getElementById("search").value;
    const apiKey = "9787f830694d4dc59ab410ac7d6c77b3"; 
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}`;

    if (!query) {
        alert("Please enter a search term.");
        return;
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const recipes = data.results;

        if (recipes.length === 0) {
            document.getElementById("recipe-list").innerHTML = "<p>No recipes found.</p>";
            return;
        }

        displayRecipes(recipes);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        document.getElementById("recipe-list").innerHTML = `<p>Error fetching recipes: ${error.message}. Please try again later.</p>`;
    }
}

async function fetchRecipeDetails(recipeId) {
    const apiKey = "9787f830694d4dc59ab410ac7d6c77b3"; 
    const detailsUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    const response = await fetch(detailsUrl);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
            <img src="${recipe.image}" alt="${recipe.title}" onclick="showRecipeDetails(${recipe.id})" style="cursor:pointer;">
            <h3>${recipe.title}</h3>
        `;
        recipeList.appendChild(recipeDiv);
    });
}

async function showRecipeDetails(recipeId) {
    try {
        const recipe = await fetchRecipeDetails(recipeId);
        const recipeDetails = `
            <h3>${recipe.title}</h3>
            <img src="${recipe.image}" alt="${recipe.title}">
            <h4>Ingredients:</h4>
            <ul class="ingredients">
                ${recipe.extendedIngredients.length > 0 ? 
                    recipe.extendedIngredients.map(ingredient => `<li>${ingredient.original}</li>`).join('') : 
                    "<li>No ingredients available.</li>"}
            </ul>
            <h4>Instructions:</h4>
            <p>${recipe.instructions || "No instructions available."}</p>
            <button onclick="goBackToList()">Back to recipes</button>
        `;

        const recipeList = document.getElementById("recipe-list");
        recipeList.innerHTML = recipeDetails; 
    } catch (error) {
        console.error("Error fetching recipe details:", error);
        alert("An error occurred while fetching recipe details. Please try again.");
    }
}

function goBackToList() {
    document.getElementById("recipe-list").innerHTML = ""; // Clear the current details
    document.getElementById("search").value = ""; // Clear the search input
}
