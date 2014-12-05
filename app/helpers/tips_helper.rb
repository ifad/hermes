module TipsHelper

  def edit_tip_link(tip)
    @tutorial ? edit_site_tutorial_tip_path(@site, @tutorial, tip) : edit_site_tip_path(@site, tip)
  end

  def destroy_tip_link(tip)
    @tutorial ? site_tutorial_tip_path(@site, @tutorial, tip) : site_tip_path(@site, tip)
  end

  def index_title
    @tutorial ? "Tips for tutorial #{@tutorial.title} (#{@site.name} site)" : "Tips for #{ @site.name }"
  end

  def new_tip_link
    @tutorial ? new_site_tutorial_tip_path(@site, @tutorial) : new_site_tip_path(@site)
  end

  def preview_tip_link(tip)
    preview_sub_path = "http://#{@site.hostname}#{tip.path}#hermes-preview"
    m_path = @tutorial ? "#{message_tutorial_path(@tutorial.id, tip.class.model_name.param_key, tip.id)}" : "#{message_path(tip.class.model_name.param_key, tip.id)}"
    "#{preview_sub_path},#{m_path}"
  end

end
