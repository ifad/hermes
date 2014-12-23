class AddFlagsToTutorials < ActiveRecord::Migration
  def change
    add_column :tutorials, :overlay, :boolean, default: true
    add_column :tutorials, :progress_bar, :boolean, default: true
  end
end
