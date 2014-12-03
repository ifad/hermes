module TipsHelper

  def edit_tip_link(tip)
    @tutorial ? edit_site_tutorial_tip_path(@site, @tutorial, tip) : edit_site_tip_path(@site, tip)
  end

  def destroy_tip_link(tip)
    @tutorial ? site_tutorial_tip_path(@site, @tutorial, tip) : site_tip_path(@site, tip)
  end

  def index_title
    @tutorial ? "Messages for tutorial #{@tutorial.title} (#{@site.name} site)" : "Messages for #{ @site.name }"
  end

  def new_tip_link
    @tutorial ? new_site_tutorial_tip_path(@site, @tutorial) : new_site_tip_path(@site)
  end

end
