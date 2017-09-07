class UsersController < ApplicationController

	get '/signup' do
		erb :'users/signup'
	end

	post '/signup' do
		@user = User.create(params)
		if @user.save
			redirect '/login'
		else
			flash[:message] = "Invalid input! Please try again!"
			erb :'users/signup'
		end
	end

	get '/login' do
		erb :'users/login'
	end

	post '/login' do
		@user = User.find_by(username: params[:username])
		if @user && @user.authenticate(params[:password])
			session[:user_id] = @user.id 
			redirect "/users/#{@user.username}"
		else
			flash[:message] = "Invalid username or password! Please try again!"
			erb :'users/login'
		end
	end

	get '/users/:username' do
		@user = User.find_by(username: params[:username])
		@recipe = @user.recipes 
		erb :'users/show'
	end

	get '/logout' do
		session.clear
		redirect '/'
	end

end