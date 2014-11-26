# encoding: utf-8

module ApplicationHelper
  def logo
    link_to root_path, :id => 'logo', :class => 'navbar-brand' do
      image_tag('hermes-logo.png', size: '22x22') + content_tag(:span, 'Hermes')
    end.to_s
  end

  def gravatar(email, size)
    gravatar_id = Digest::MD5.hexdigest(email.downcase)
    return "http://gravatar.com/avatar/#{gravatar_id}?size=#{size}&default=identicon"
  end
end
