class Recipe < ActiveRecord::Base
	belongs_to :user

	def slug
		name.downcase.gsub(" ","-")
	end

	def self.find_by_slug(slug)
		Recipe.all.find{|recipe| recipe.slug == slug}
	end
end