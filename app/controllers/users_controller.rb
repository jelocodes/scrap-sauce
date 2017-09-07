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

end