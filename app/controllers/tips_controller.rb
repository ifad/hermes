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
    if @tips.blank?
      redirect_to @tutorial ? new_site_tutorial_tip_path(@site, @tutorial) : new_site_tip_path(@site)
    end
  end

  def show
  end

  def new
    @tip = @site.tips.new
    @tutorial = Tutorial.find(params[:tutorial_id]) if params[:tutorial_id]
  end

  def create
    @tutorial = Tutorial.find(params[:tutorial_id]) if params[:tutorial_id]
    @tip = @site.tips.new(tip_params)
    if @tip.save
      @tutorial.tips << @tip if @tutorial
      redirect_to @tutorial ? site_tutorial_tips_path(@site, @tutorial) : site_tips_path(@site)
    else
      flash.now[:error] = 'There was an error saving your message.'
      if @tutorial
        render :new, tutorial_id: params[:tutorial_id]
      else
        render :new
      end
    end
  end

  def edit
  end

  def update
    if @tip.update_attributes(tip_params)
      if @tutorial
        redirect_to site_tutorial_tips_path(@site, @tutorial), :notice => "Message '#{@tip.title}' for tutorial '#{@tutorial.title}' saved"
      else
        redirect_to site_tips_path(@site), :notice => "Message '#{@tip.title}' saved"
      end
    else
      flash.now[:error] = 'There was an error updating your message.'
      render :edit
    end
  end

  def destroy
    @tip.destroy

    respond_to do |format|
      format.js
    end
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
      @tutorial = Tutorial.find(params[:tutorial_id]) if params[:tutorial_id].present?
      @tip = @tutorial ? @tutorial.tips.find(params[:id]) : @site.tips.find(params[:id])
    end

    def tip_params
      params.require(:tip).permit(
        :title, :content, :published_at, :path,
        :unpublished_at, :selector, :position, :redisplay,
        :tutorial_id, :site_host_ref
      ).tap do |params|
        params[:redisplay] = nil if params[:redisplay] === '0'
        params[:site_host_ref] = nil unless @tutorial
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
      @tip_connector_token = "authoring"
    end
end
