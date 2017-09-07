// Entire App

var scrapSauce= {};

// selected ingredients
scrapSauce.ingredients = [];

// favourited recipes
scrapSauce.recipes = [];

// Yummly API info

scrapSauce.apikey = "f235b2cf2658a138b83a42670e7c1374";
scrapSauce.appId = "441e00da";

// jQuery selectors

scrapSauce.chosenMeals = $('.chosenMeals ul');
scrapSauce.generatedRecipesList = $('.recipes ul');
scrapSauce.ingredientsSpan = $('#ingredients');
scrapSauce.manualAddField = $('#addField');
scrapSauce.manualAddButton = $('.manualAdd a');

// Functions

scrapSauce.removeFromIngredients = function(element){
    var index = scrapSauce.ingredients.indexOf(element.text().toLowerCase());
    scrapSauce.ingredients.splice(index, 1);
};

scrapSauce.addRecipe = function(id){

    // add recipe id to scrapSauce.recipes array
    scrapSauce.recipes.push(id);

    // make AJAX call to get full recipe

    $.ajax({
        url: 'https://api.yummly.com/v1/api/recipe/' + id,
        type: 'GET',
        data: {
            format: 'jsonp',
            _app_key: scrapSauce.apikey,
            _app_id: scrapSauce.appId
        },
        dataType: 'jsonp',
        success: function(recipe){
             console.log(recipe);
             // Update ".chosenMeals" to display the fetched recipe
             scrapSauce.addFavourite(recipe);
             // Persists the favourited recipe to database
             scrapSauce.save(recipe);
        }
    });
};

scrapSauce.save = function(recipe) {
        var ingredients = recipe.ingredientLines
        var dataToSave = {
            name: recipe.name,
            images: recipe.images[0],
            recipe: ingredients,
            total_time: recipe.totalTime,
            }
        // testing with alert
        alert(JSON.stringify(dataToSave))
        $.ajax({
            url: '/recipes/new',
            dataType: 'json',
            type: 'POST',
            data: {recipe: JSON.stringify(dataToSave)},
            success: function(data) {
                alert("Successful");
            },
            failure: function() {
                alert("Unsuccessful");
            }
        });
}

scrapSauce.manuallyAdd = function(inputField){

    inputField.keypress(function(event){

        if (event.which === 13){

            var newContent = inputField.val();
            inputField.val("");

            // I'm adding this weird if statement because the program was buggy and kept looping twice, three times, four times on manual add. Don't know why, should figure out.

            if (newContent) {

                scrapSauce.ingredients.push(newContent);

                if (inputField.attr("id") == "editField") {

                    inputField.parent().html(newContent + "<a href='#' class='delete' onclick='event.preventDefault();'><i class='fa fa-times'></i></a>");

                    // super sketch about having to put this function here:

                    $('.editable .delete').on('click', function(){

                        // if the ingredient was added from the NoFrills flyer, unhighlight it
                        var editableSpan = $(this).parent();
                        var highlightedSpan = $('#' + editableSpan.text().replace(/\s/, ''));
                        if (highlightedSpan.length) {
                            highlightedSpan.removeClass("selected");
                        }

                        // remove the ingredient from mealPlan.ingredients
                        scrapSauce.removeFromIngredients(editableSpan);

                        scrapSauce.updateh2();

                        if (!$.isEmptyObject(scrapSauce.ingredients)) {
                            scrapSauce.getRecipes(scrapSauce.ingredients);
                        }

                    });

                } else { // the input field is "addField" from manual input.

                    scrapSauce.updateh2();

                    inputField.slideUp();
                }
                
                // fire a new AJAX call for the new ingredients
                scrapSauce.getRecipes(scrapSauce.ingredients);
            }
        }
    });
};

scrapSauce.updateh2 = function(){

    // if mealPlan.ingredients is empty, make h2 display "..." again; otherwise, update h2 with the new list of ingredients.
    if ($.isEmptyObject(scrapSauce.ingredients)) {
        scrapSauce.ingredientsSpan.html("...");
        scrapSauce.generatedRecipesList.html("");
    } else {
        scrapSauce.ingredientsSpan.html(
            '<span class="editable">' + scrapSauce.ingredients.join('<a href="#" class="delete" onclick="event.preventDefault();"><i class="fa fa-times"></i></a></span> and <span class="editable">') + '<a href="#" class="delete" onclick="event.preventDefault();"><i class="fa fa-times"></i></a></span>'
        );
        $('p.hint').show();
    }

    $('.editable').dblclick(function(){

        var innerText = $(this).text();

        // temporarily remove the double-clicked ingredient from mealPlan.ingredients
        scrapSauce.removeFromIngredients($(this));

        // Turn inner text html into an input field CONTAINING the inner text
        $(this).html(
            '<input type="text" id="editField" value="' + innerText + '">'
        );

        scrapSauce.manuallyAdd($('#editField'));

    });

    $('.editable .delete').on('click', function(){

        // remove the ingredient from mealPlan.ingredients
        scrapSauce.removeFromIngredients(editableSpan);

        scrapSauce.updateh2();

        if (!$.isEmptyObject(scrapSauce.ingredients)) {
            scrapSauce.getRecipes(scrapSauce.ingredients);
        }

    });

};

scrapSauce.getRecipes = function(ingredient){
    $.ajax({
        url: 'https://api.yummly.com/v1/api/recipes',
        type: 'GET',
        data: {
            format: 'jsonp',
            _app_key: scrapSauce.apikey,
            _app_id: scrapSauce.appId,
            allowedIngredient: ingredient
        },
        dataType: 'jsonp',
        success: function(result){
             console.log("here I'm logging just 'result':");
             console.log(result);
             console.log(result.matches);
             scrapSauce.displayRecipes(result.matches);
        }
    });
};

