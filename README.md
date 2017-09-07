# scrap-sauce
Quick weekend project: Sinatra app that returns Yumli scraped recipes featuring ingredients based on user inputted leftovers

This app will use Sinatra for its server/backend and Sinatra/Active Record for its log in system and routes

This app will use the Yummly API to scrape recipes based on user input and jQuery/JS to display results on screen.

The logged in user can then save their chosen recipes with a jQuery action to our backend database and link it to the user's id

Simple domain model:
User (username, password, email[id])
Recipe (name, ingredients, calories, user_id)
