module TipsHelper

  def edit_tip_link(tip)
    @tutorial ? edit_site_tutorial_tip_path(@site, @tutorial, tip) : edit_site_tip_path(@site, tip)
  end

  def destroy_tip_link(tip)
    @tutorial ? site_tutorial_tip_path(@site, @tutorial, tip) : site_tip_path(@site, tip)
  end

end
