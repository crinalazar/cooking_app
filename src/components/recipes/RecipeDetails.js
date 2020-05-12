import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import '../../style/cooking-app.css';

function RecipeDetails() {  
    const { recipeId } = useParams();

    const [recipe, setRecipe] = useState(null);
    const [ingredients, setIngredients] = useState(null);
    const [name, setName] = useState(null);

    async function getRecipeById() {
        try {
            const res = await axios('http://localhost:5000/Recipes/' + recipeId);
            setRecipe(res.data);
            setIngredients(res.data.Ingredients);
            const user = await axios.get('http://localhost:5000/UsersRecipes/', { params: { recipeId : recipeId }})
                        .then(user => {
                            const userName = axios.get('http://localhost:5000/Users/' + user.data[0].userId)
                                .then(name => setName(name.data.FirstName + " " + name.data.LastName))
                        })
        } catch(e) {
            console.warn(e);
        }
    }
    
    useEffect(() => { 
        getRecipeById(recipeId); 
    }, [recipeId]);
   
    if(recipe && ingredients) {
        return (
            <div className= "recipeDetailsWrapper">
                <p className="recipe-name details-name">{recipe.RecipeName} </p>
                <p className = "recipe-author">Recipe added by: {name} </p>
                <div className= "recipeDetails">
                    <div className="firstDet"> 
                        <p><span className= "text-det">Preparation time:</span>{recipe.PreparationTime}</p>
                        <p><span className= "text-det">Cooking time:</span>{recipe.CookingTime}</p>
                        <p><span className= "text-det">Serves: </span>{recipe.Serves}</p>
                        <p><span className= "text-det">Vegetarian: </span>{recipe.Vegetarian}</p>
                        <div className="details-ing">
                            <p className= "text-det"> Ingredients</p>
                            {ingredients.map((ing, index) => <p key={index}>{ing.quantity} - {ing.type}</p>)}
                        </div>
                    </div>
                    <img  className="details-picture" src={recipe.Picture} alt="Recipe"/>
                    <p className="details-rest"><span className= "text-det"> How to prepare: </span> {recipe.Method}</p>
                </div>
            </div>
        )} else {
        return <h1>Loading ...</h1>; 
    } 
}  

export default RecipeDetails;