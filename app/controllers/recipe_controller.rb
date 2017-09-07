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

	get '/recipes/:slug' do
		if logged_in?
			@user = User.find(session[:user_id])
		end
		@recipe = Recipe.find_by_slug(params[:slug])
		erb :'recipes/show'
	end

end