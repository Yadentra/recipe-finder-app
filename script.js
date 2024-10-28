async function searchRecipes() {
    const query = document.getElementById("search").value;
    const apiKey = "69a94256bfc943448be480751698bc50"; // My API key
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
        ingredientsDiv.style.display = "none"; 

        
        const ingredients = recipe.extendedIngredients.map(ingredient => ingredient.original).join(', ');
        ingredientsDiv.innerHTML = `<p><strong>Ingredients:</strong> ${ingredients}</p>`;

        
        recipeDiv.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.title}" style="cursor: pointer;">
            <h3>${recipe.title}</h3>
        `;
        
        
        recipeDiv.appendChild(ingredientsDiv);
        
        
        recipeDiv.querySelector("img").addEventListener("click", () => {
            ingredientsDiv.style.display = ingredientsDiv.style.display === "none" ? "block" : "none";
        });

        recipeList.appendChild(recipeDiv);
    });
}
