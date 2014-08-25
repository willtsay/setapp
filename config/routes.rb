Rails.application.routes.draw do

  root 'users#index'
  
  resources :users, only: [:index, :create]

  get '/set', to: 'games#game'


end
