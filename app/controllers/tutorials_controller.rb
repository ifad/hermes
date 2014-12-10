class TutorialsController < ApplicationController
  include Authenticated

  before_filter :find_site
  before_filter :find_tutorial, only: %w( show edit update destroy )
  before_filter :generate_xd_token, only: %w( new edit )

  def index
    @tutorials = @site.tutorials.order('created_at DESC') # FIXME

    if @tutorials.blank?
      redirect_to new_site_tutorial_path(@site)
    end
  end

  def show
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
      redirect_to site_tutorials_path(@site), :notice => 'tutorial saved'
    else
      render :edit
    end
  end

  def destroy
    @tutorial.destroy
    redirect_to site_tutorials_path(@site), :notice => 'tutorial deleted'
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
               :selector, :welcome_message)
    end

    # This is a token to passed between the #tip-connector and the
    # target web site, to enable the authoring component in it and
    # to authorize communication.
    #
    # TODO: actually use a random token and verify it - for now it
    # is only used to pass the opener scheme to postMessage.
    #
    def generate_xd_token
      @tutorial_connector_token = "#hermes-authoring-tutorial,#{request.scheme}"
    end
end
