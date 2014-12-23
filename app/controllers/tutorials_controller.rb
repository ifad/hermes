class TutorialsController < ApplicationController
  include Authenticated

  before_filter :find_site
  before_filter :find_tutorial, only: %w( show edit update destroy )
  before_filter :generate_xd_token, only: %w( new edit )

  def index
    @tutorials = @site.tutorials.order('created_at DESC')

    if @tutorials.blank?
      redirect_to new_site_tutorial_path(@site)
    end
  end

  def show
    @tips = Tip.where(tippable_id: @tutorial.id, tippable_type: 'Tutorial').sort_by_row_order
  end

  def new
    @tutorial = @site.tutorials.new
  end

  def create
    @tutorial = @site.tutorials.new(tutorial_params)

    if @tutorial.save
      redirect_to site_tutorials_path(@site)
    else
      flash.now[:error] = 'There was an error saving your tutorial.'
      render :new
    end
  end

  def edit
  end

  def update
    if @tutorial.update_attributes(tutorial_params)
      # update also tips that don't have path
      @tutorial.tips.each do |tip|
        if (tip.path.blank? || tip.path == '/') && tip.site_host_ref.blank?
          tip.path = @tutorial.path
          tip.save!
        end
      end
      redirect_to site_tutorials_path(@site), :notice => 'tutorial saved'
    else
      render :edit
    end
  end

  def destroy
    @tutorial.destroy
    respond_to do |format|
      format.js
    end
  end

  protected

    def find_site
      @site = Site.find(params[:site_id])
    end

    def find_tutorial
      @tutorial = @site.tutorials.find(params[:id])
    end

    def tutorial_params
      params.
        require(:tutorial).
        permit(:title, :published_at,
               :unpublished_at, :path, :position,
               :selector, :welcome_message,
               :overlay, :progress_bar, :path_re)
    end

    # This is a token to passed between the #tip-connector and the
    # target web site, to enable the authoring component in it and
    # to authorize communication.
    #
    # TODO: actually use a random token and verify it - for now it
    # is only used to pass the opener scheme to postMessage.
    #
    def generate_xd_token
      @tutorial_connector_token = "authoring-tutorial"
    end
end
