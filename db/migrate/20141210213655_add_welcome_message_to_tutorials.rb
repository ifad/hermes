class AddWelcomeMessageToTutorials < ActiveRecord::Migration
  def change
    add_column :tutorials, :welcome_message, :string
  end
end
