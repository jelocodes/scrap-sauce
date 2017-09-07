class CreateRecipes < ActiveRecord::Migration[5.1]
  def change
  	create_table :recipes do |t|
  		t.string :name
  	  	t.string :images
  		t.integer :total_time
  		t.text :recipe
  	end
  end
end
