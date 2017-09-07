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

