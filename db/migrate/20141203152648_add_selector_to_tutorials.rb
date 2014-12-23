class AddSelectorToTutorials < ActiveRecord::Migration
  def change
    add_column :tutorials, :selector, :string
  end
end
