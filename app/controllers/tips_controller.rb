class TipsController < ApplicationController
  include Authenticated

  before_filter :find_site, except: :position
  before_filter :find_tip, only: %w( show edit update destroy )
  before_filter :generate_xd_token, only: %w( new edit )

  def index
    @tutorial = Tutorial.find(params[:tutorial_id]) if params[:tutorial_id]
    if @tutorial
      @tips = Tip.where(tippable_id: @tutorial.id, tippable_type: 'Tutorial').sort_by_row_order
    else
      @tips = @site.tips.sort_by_row_order
    end
  end

  def show
  end

  def new
    @tip = @site.tips.new
    @tutorial = Tutorial.find(params[:tutorial_id]) if params[:tutorial_id]
  end

  def create
    @tip = @site.tips.new(tip_params)
    if @tip.save
      @tutorial = Tutorial.find(params[:tutorial_id]) if params[:tutorial_id]
      @tutorial.tips << @tip if @tutorial
      redirect_to @tutorial ? site_tutorial_tips_path(@site, @tutorial) : site_tips_path(@site)
    else
      flash.now[:error] = 'There was an error saving your message.'
      render :new
    end
  end

  def edit
  end

  def update
    if @tip.update_attributes(tip_params)
      redirect_to site_tips_path(@site), :notice => "Message '#{@tip.title}' saved"
    else
      flash.now[:error] = 'There was an error updating your message'.
      render :edit
    end
  end

  def destroy
    @tip.destroy

    render js: "$('##{dom_id(@tip)}').hide('fade');"
  end

  # Sets the given tip position
  def position
    @tip = Tip.find(params[:id])

    head :bad_request and return unless params[:pos]
    pos = params[:pos].to_i

    head :bad_request and return unless pos >= 0

    @tip.position = pos
    @tip.save!

    head :ok
  end

  protected

    def find_site
      @site = Site.find(params[:site_id])
    end

    def find_tip
      @tip = @site.tips.find(params[:id])
    end

    def tip_params
      params.require(:tip).permit(
        :title, :content, :published_at, :path,
        :unpublished_at, :selector, :position, :redisplay,
        :tutorial_id
      ).tap do |params|
        params[:redisplay] = nil if params[:redisplay] === '0'
      end
    end

    # This is a token to passed between the #tip-connector and the
    # target web site, to enable the authoring component in it and
    # to authorize communication.
    #
    # TODO: actually use a random token and verify it - for now it
    # is only used to pass the opener scheme to postMessage.
    #
    def generate_xd_token
      @tip_connector_token = "#hermes-authoring,#{request.scheme}"
    end
end
