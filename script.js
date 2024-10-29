async function searchRecipes() {
    const query = document.getElementById("search").value;
    const apiKey = "9787f830694d4dc59ab410ac7d6c77b3";
    const apiUrl = `https://api.spoonacular.com/recipes/complexSearch?query=${query}&apiKey=${apiKey}&number=10`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        displayRecipes(data.results);
    } catch (error) {
        console.error("Error fetching recipes:", error);
        alert("An error occurred while fetching recipes. Please try again.");
    }
}

function displayRecipes(recipes) {
    const recipeList = document.getElementById("recipe-list");
    recipeList.innerHTML = "";

    recipes.forEach(recipe => {
        const recipeDiv = document.createElement("div");
        recipeDiv.classList.add("recipe");

        recipeDiv.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" onclick="showIngredients(${recipe.id})">
            <h3>${recipe.title}</h3>
        `;
        recipeList.appendChild(recipeDiv);
    });
}

async function showIngredients(recipeId) {
    const apiKey = "9787f830694d4dc59ab410ac7d6c77b3";
    const apiUrl = `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const ingredients = data.extendedIngredients.map(ing => ing.original);

        const ingredientsDiv = document.createElement("div");
        ingredientsDiv.classList.add("ingredients");
        ingredientsDiv.innerHTML = `
            <h4>Ingredients for ${data.title}:</h4>
            <ul>${ingredients.map(item => `<li>${item}</li>`).join('')}</ul>
        `;

        const recipeList = document.getElementById("recipe-list");
        recipeList.appendChild(ingredientsDiv);
    } catch (error) {
        console.error("Error fetching ingredients:", error);
        alert("An error occurred while fetching ingredients. Please try again.");
    }
}
