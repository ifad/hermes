# This controllers is the backend core, from which users manage the sites
# they want to get the help elements in.
#
class SitesController < ApplicationController
  include Authenticated

  before_filter :find_site, :only => %w( show edit update destroy )

  def index
    @site = Site.new
  end

  def show
  end

  def new
    @site = Site.new
  end

  def create
    @site = current_user.sites.new(sites_param)
    @site.save

    respond_to do |format|
      format.html { redirect_to sites_path }
      format.js
    end
  end

  def edit
    respond_to do |format|
      format.html
      format.js
    end
  end

  def update
    @site.update_attributes(sites_param)

    respond_to do |format|
      format.js
    end
  end

  def destroy
    @site.destroy
    respond_to do |format|
      format.js
    end
  end

  def general_broadcast
    @sites = Site.all
    @saved = true
    @sites.each do |site|
      tip = site.tips.new(tip_params)
      @saved = false unless tip.save
    end
    respond_to do |format|
      format.js
    end
  end

  protected
    def sites_param
      params.require(:site).permit(:name, :hostname, :description)
    end

    def tip_params
      params.require(:tip).permit(
        :title, :content, :published_at, :path,
        :unpublished_at, :selector, :position, :redisplay
      )
    end

    def find_site
      @site = Site.find(params[:id])
    end
end
