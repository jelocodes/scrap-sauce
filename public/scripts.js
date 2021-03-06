// Entire App

var scrapSauce= {};

// selected ingredients
scrapSauce.ingredients = [];

// favourited recipes
scrapSauce.recipes = [];

// Yummly API info

scrapSauce.apikey = "f9822733e81476b2df68dc44e070beec";
scrapSauce.appId = "bb15248b";

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

                        var editableSpan = $(this).parent();
                        var highlightedSpan = $('#' + editableSpan.text().replace(/\s/, ''));
                        if (highlightedSpan.length) {
                            highlightedSpan.removeClass("selected");
                        }

                        // remove the ingredient from scrapSauce.ingredients
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

    // if scrapSauce.ingredients is empty, make h2 display "..." again; otherwise, update h2 with the new list of ingredients.
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

        // temporarily remove the double-clicked ingredient from scrapSauce.ingredients
        scrapSauce.removeFromIngredients($(this));

        // Turn inner text html into an input field CONTAINING the inner text
        $(this).html(
            '<input type="text" id="editField" value="' + innerText + '">'
        );

        scrapSauce.manuallyAdd($('#editField'));

    });

    $('.editable .delete').on('click', function(){

        // remove the ingredient from scrapSauce.ingredients
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

scrapSauce.displayRecipes = function(recipes){
    // clear the current 'recipes' div
    scrapSauce.generatedRecipesList.html("");

    // update the recipes div
    $.each(recipes, function(i, recipe){
        console.log(recipe);
        var title = $('<h3>').text(recipe.recipeName);
        var source = $('<p>').text("From " + recipe.sourceDisplayName).attr('class', 'from');
        if (recipe.smallImageUrls){
            var image = $('<img>').attr('src', recipe.smallImageUrls[0]);
        } else {
            var image = $('<img>');
        }
        // var ingredients = $('<ul>').html("<li>" + recipe.ingredients.join("</li><li>") + "</li>");
        var ingredients = $('<p>').text("Ingredients: " + recipe.ingredients.join(", ")).attr('class', 'ings');
        //var add = $('<a>').html('<i class="fa fa-plus"></i> Add Recipe to Meal Plan').attr({
        var more = $('<a>').html('<i class="fa fa-plus"></i> See More').attr({
            href: '#',
            class: 'seeMore',
            id: recipe.id,
            onclick: 'event.preventDefault();'
        });
        var fav = $('<a>').html('<i class="fa fa-star-o"></i> Favourite').attr({
            href: '#',
            class: 'fav',
            onclick: "event.preventDefault(); scrapSauce.addRecipe('" + recipe.id + "');"
        });
        var noThanks = $('<a href="#" onclick="event.preventDefault();" class="noThanks">').append($('<i class="fa fa-times">'));

        scrapSauce.generatedRecipesList.append($('<li class="recipe">').append(title, source, image, ingredients, more, fav, noThanks));
    });

    $('.seeMore').on('click', function(){
        $.ajax({
            url: 'https://api.yummly.com/v1/api/recipe/' + $(this).attr('id'),
            type: 'GET',
            data: {
                format: 'jsonp',
                _app_key: scrapSauce.apikey,
                _app_id: scrapSauce.appId
            },
            dataType: 'jsonp',
            success: function(recipe){
                 console.log(recipe);
                 // eventually make this slide down:
                 scrapSauce.displayDetails(recipe);
            }
        });
    });

    $('.fav').on('click', function(){
        $(this).html('<i class="fa fa-star"></i> Favourited').addClass('favourited');
        $('.noRecipes').remove();

        $('.favourited').on('click', function(){
            $(this).html('<i class="fa fa-star-o"></i> Favourite').removeClass('favourited');
        });
    });

    $('.noThanks').on('click', function(){
        $(this).parent().slideUp();
        $(this).remove();
    });
};

scrapSauce.displayDetails = function(recipe){

    var seeMoreLink = $('#' + recipe.id);
    seeMoreLink.siblings('.from').html("<a href='" +
        recipe.source.sourceRecipeUrl +
        "'>Original Recipe</a> from <a href='" + 
        recipe.source.sourceSiteUrl + 
        "'>" + 
        recipe.source.sourceDisplayName +
        "</a>");

    var recipeImage = seeMoreLink.siblings('img');

    if (recipe.images.length) {
        recipeImage.attr('src', recipe.images[0].hostedLargeUrl);
    }

    if (recipe.yield) {
        recipeImage.after($('<p>').html(recipe.yield),
        $('<p>').html("Total time: " + recipe.totalTime));
    } else {
        recipeImage.after($('<p>').html("Total time: " + recipe.totalTime));
    }

    var ingredients = $('<ul>').html("<li>" + recipe.ingredientLines.join("</li><li>") + "</li>");
    seeMoreLink.siblings('.ings').replaceWith(ingredients);

    seeMoreLink.replaceWith($('<p>').html(recipe.attribution.html));

};

$(function(){

    $('.noThanks').on('click', function(){
        $(this).parent().slideUp();
        $(this).remove();
    });

    scrapSauce.manualAddButton.on('click', function(){
        scrapSauce.manualAddField.slideDown();
        scrapSauce.manuallyAdd(scrapSauce.manualAddField);
    });

});

scrapSauce.addFavourite = function(recipe){
    console.log(recipe);
    var title = $('<h3>').text(recipe.name);

    if (recipe.images.length) {
        var image = $('<img>').attr('src', recipe.images[0].hostedLargeUrl);
    } else {
        var image = $('<img>');
    }

    var recipeId = (parseInt($("input[name='recipe_id']").last().attr("value")) + 1).toString();  

    var slug = title.text().replace(/ /g,'-').replace(/<h3>/g,'').replace(/<\/h3>/g,'').toLowerCase();

    var more = $('<p><a href="/recipes/' + slug + '">See more</a></p>');

    var del = $('<form action="/recipes/delete" method="POST">').html('<input id="hidden" type="hidden" name="_method" value="delete"><input type="hidden" name="recipe_id" value="'+ recipeId +'"><input type="submit" value="Delete">');

    scrapSauce.chosenMeals.append($('<li class="meal">').append(title, image, more, del));

};
