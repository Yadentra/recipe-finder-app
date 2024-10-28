async function searchRecipes() {
    const query = document.getElementById("search").value;
    const apiKey = "69a94256bfc943448be480751698bc50"; // Your API key
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

        const ingredientsDiv = document.createElement("div");
        ingredientsDiv.classList.add("ingredients");
        const ingredients = recipe.extendedIngredients.map(ingredient => ingredient.original).join(', ');
        ingredientsDiv.innerHTML = `<p><strong>Ingredients:</strong> ${ingredients}</p>`;

        const instructionsDiv = document.createElement("div");
        instructionsDiv.classList.add("instructions");
        instructionsDiv.innerHTML = `<p><strong>Instructions:</strong> ${recipe.instructions}</p>`;

        recipeDiv.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}">
            <h3>${recipe.title}</h3>
        `;

        recipeDiv.appendChild(ingredientsDiv);
        recipeDiv.appendChild(instructionsDiv);

        recipeDiv.querySelector("img").addEventListener("click", () => {
            const currentIngredientsDisplay = ingredientsDiv.style.display;
            const currentInstructionsDisplay = instructionsDiv.style.display;
            ingredientsDiv.style.display = currentIngredientsDisplay === "none" || currentIngredientsDisplay === "" ? "block" : "none";
            instructionsDiv.style.display = currentInstructionsDisplay === "none" || currentInstructionsDisplay === "" ? "block" : "none";
        });

        recipeList.appendChild(recipeDiv);
    });
}
