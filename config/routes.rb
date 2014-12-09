Hermes::Application.routes.draw do
  url_root = ENV['RAILS_RELATIVE_URL_ROOT'] || ''

  scope url_root do
    devise_for :users, path: "#{url_root}/users", failure_app: (
      # This is an hack to overcome a bug in Devise with relative url roots.
      # The original FailureApp prefixes the relative_url_root to the path
      # returned by the route helpers, that already contain it, resulting in a
      # double path being generated. So, here we temporarily remove the URL
      # root from the Rails configuration, to reinstate it after calling the
      # parent method.
      #
      #  - vjt  Thu Jan 10 20:46:55 CET 2013
      #
      if url_root.present?
        Class.new(Devise::FailureApp) do
          def scope_path
            config = Rails.application.config
            root   = config.relative_url_root
            begin
              config.relative_url_root = nil
              super
            ensure
              config.relative_url_root = root
            end
          end
        end
      else
        Devise::FailureApp
      end
    )

    root :to => 'sites#index'

    resources :sites do
      resources :tips
      resources :tutorials do 
        resources :tips
      end
    end

    put '/tips/:id/position'  => 'tips#position'

    # tutorials (from client)
    get "/messages/tutorials.js"                   => "messages#tutorials"
    get "/messages/tutorials/:tutorial_id.js"      => "messages#tutorial"
    get "/message/tutorial/:tutorial_id/:type/:id" => "messages#show_tutorial_message", as: :message_tutorial

        # messages (from client)
    get "/messages.js"        => "messages#index"
    get "/messages/:type/:id" => "messages#update", as: :dismiss_message
    get "/message/:type/:id"  => "messages#show",   as: :message

  end
end
