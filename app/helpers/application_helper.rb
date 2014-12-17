# encoding: utf-8

module ApplicationHelper
  def logo
    link_to root_path, :id => 'logo', :class => 'navbar-brand' do
      image_tag('hermes-logo.png', size: '22x22') + content_tag(:span, 'Hermes', class: 'hermes-title')
    end.to_s
  end

  def gravatar(email, size)
    gravatar_id = Digest::MD5.hexdigest(email.downcase)
    return "//gravatar.com/avatar/#{gravatar_id}?size=#{size}&default=identicon"
  end

  def logo_big
    image_tag 'hermes-logo.png', class: 'logo', width: 35, height: 33
  end

  def hermes_embed_url
    "#{root_url}assets/hermes.js"
  end

  def any_sites?
    @any_sites ||= Site.by_user(current_user).any?
  end
end
