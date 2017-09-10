# Scrap Sauce

Scrap Sauce is a Sinatra app that allows users to sign up, log in, search for and save recipes. Input any leftover foods that you have lying around, and the app returns a list of recipes that includes that food as ingredients. It uses the Yummly API to fetch recipes (in JSON) from its database that match user input via AJAX calls. It uses Sinatra/Rack for the back-end routes/sever and ActiveRecord to maintain the database. 

Installation & Usage

To use this app, just clone, run rake db:migrate and then run shotgun. The server will start and everything should be set up. Sign Up, log in and find recipes right away!

Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/jelocodes/scrap-sauce. This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org/) code of conduct.

License

This codebase is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).