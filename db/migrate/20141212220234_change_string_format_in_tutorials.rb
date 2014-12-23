class ChangeStringFormatInTutorials < ActiveRecord::Migration
  def up
   change_column :tutorials, :welcome_message, :text
  end

  def down
   change_column :tutorials, :welcome_message, :string
  end
end
