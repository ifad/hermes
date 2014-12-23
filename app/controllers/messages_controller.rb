# This controller serves JS embed files for external sites.
# The remote site is identified through the HTTP Referer header.
#
class MessagesController < ApplicationController

  before_filter :require_callback
  before_filter :find_site
  before_filter :find_message, only: %w( show update show_tutorial_message )

  skip_before_action :verify_authenticity_token

  def index
    head :not_found and return unless @site

    remote_user = (cookies['__hermes_user'] ||= State.ephemeral_user)

    @messages = @site.tips.published.sorted.within(@source.path).respecting(remote_user)

    render json: render_to_string(template: 'messages/index.json'), callback: @callback
  end

  def tutorial
    head :not_found and return unless @site

    @tutorials = @site.tutorials.where(id: params[:tutorial_id])

    render json: render_to_string(template: 'messages/tutorials.json'), callback: @callback
  end

  def tutorials
    head :not_found and return unless @site

    remote_user = (cookies['__hermes_user'] ||= State.ephemeral_user)

    @tutorials = @site.tutorials.published.within(@source.path)

    render json: render_to_string(template: 'messages/tutorials.json'), callback: @callback
  end

  # Render a single tip, bypassing the State machinery, for preview purposes.
  # Used by hermes.js in the preview() function, linked from the tips/_tip
  # partial in the backend interface.
  #
  def show
    json = render_to_string partial: 'messages/message', object: @message
    render json: json, callback: @callback
  end

  def show_tutorial_message
    json = render_to_string partial: 'messages/message', object: @message
    render json: json, callback: @callback
  end

  # Updates the status of the given message type and ID for the hermes_user
  # stored in the cookies.
  #
  # params[:until] is expected to be a JS timestamp, that is - milliseconds
  # passed after the Unix Epoch.
  #
  def update
    head :bad_request and return unless @message.present?

    remote_user = cookies['__hermes_user']
    head :bad_request and return unless remote_user.present?

    up_to = if params[:until].present?
      Time.at(params[:until].to_i / 1000)
    end

    status = @message.dismiss!(remote_user, up_to) ? :created : :ok
    render json: {}, callback: @callback, :status => status
  end

  protected

    def require_callback
      @callback = params[:callback]
      head :bad_request unless @callback.present?
    end

    def find_site
      return unless request.referer.present?

      @source = URI.parse(request.referer)
      return unless @source.scheme.in? %w( http https )
      @site = Site.by_url(@source)

    rescue URI::InvalidURIError
      nil
    end

    def find_message
      return unless params.values_at(:type, :id).all?(&:present?)
      model = params[:type].camelize.constantize

      return unless model.included_modules.include?(Publicable)
      @message = model.find(params[:id])
    end

end
