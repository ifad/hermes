class AddSiteHostRefToTips < ActiveRecord::Migration
  def change
    add_column :tips, :site_host_ref, :string
  end
end
