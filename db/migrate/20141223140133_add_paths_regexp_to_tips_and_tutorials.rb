class AddPathsRegexpToTipsAndTutorials < ActiveRecord::Migration
  def change
    add_column :tips,      :path_re, :string, default: '^/$', null: false
    add_column :tutorials, :path_re, :string, default: '^/$', null: false
  end
end
