module TipsHelper

  def edit_tip_link(tip)
    @tutorial ? edit_site_tutorial_tip_path(@site, @tutorial, tip) : edit_site_tip_path(@site, tip)
  end

  def destroy_tip_link(tip)
    @tutorial ? site_tutorial_tip_path(@site, @tutorial, tip) : site_tip_path(@site, tip)
  end

  def index_title
    @tutorial ? "All tips for <b>#{h @tutorial.title}</b> tutorial:" : "All tips:"
  end

  def new_tip_link
    @tutorial ? new_site_tutorial_tip_path(@site, @tutorial) : new_site_tip_path(@site)
  end

  def preview_tip_link(tip)
    m_path = @tutorial ? "#{message_tutorial_path(@tutorial.id, tip.class.model_name.param_key, tip.id)}" : "#{message_path(tip.class.model_name.param_key, tip.id)}"

    preview_path = (tip.site_host_ref.present? ? tip.site_host_ref : @site.url) + tip.path

    link_to preview_path, class: 'btn btn-default btn-xs ext', data: {messagepath: m_path} do
      content_tag :i, '', class: 'fa fa-eye'
    end
  end

  def site_path_select(f)
    f.select :site_host_ref, options_for_select((current_user.sites - [@site]).map{ |s| [s.url, s.url] }, f.object.site_host_ref), {include_blank: 'select site host ref'}
  end
end
