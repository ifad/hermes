Hermes::Application.routes.draw do
  devise_for :users

  root :to => 'sites#index'

  post '/sites/general_broadcast' => 'sites#general_broadcast', as: :general_broadcast

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
