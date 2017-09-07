class RecipeController < ApplicationController
	post '/recipes/new' do 
		hash = eval params["recipe"]
		recipe = hash[:recipe].collect do |ingredient|
			"<li>#{ingredient}</li>"
		end 
		Recipe.create(hash).update(user_id: session[:user_id], images: hash[:images][:hostedLargeUrl], recipe: recipe.to_s.gsub(/\[|\]/,'').gsub(/\"/,''))
	end

	delete '/recipes/delete' do
		@recipe = Recipe.find(params[:recipe_id])
		@recipe.destroy
		redirect '/'
	end

end