require 'rack-flash'
require './config/environment'

class ApplicationController < Sinatra::Base 
  use Rack::Flash
	configure do 
		set :public_folder, 'public'
		set :views, 'app/views'
		enable :sessions 
		set :session_secret, "password_security"
	end

    get "/" do
      if logged_in?
        @user = User.find(session[:user_id])
        @tweets = @user.recipes.all
        erb :'users/show'
      else
        erb :home
      end
    end

  helpers do 
    def logged_in?
      !!session[:user_id]
    end

    def current_user
      User.find(session[:user_id])
    end
  end

end