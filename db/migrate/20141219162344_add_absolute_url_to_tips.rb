class AddAbsoluteUrlToTips < ActiveRecord::Migration
  def change
    add_column :tips, :absolute_url, :boolean, default: false
  end
end
