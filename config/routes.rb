# frozen_string_literal: true

Rails.application.routes.draw do
  root 'home#index'

  resource :authentication, only: %i[new create destroy], controller: 'authentication'

  resources :subreddits, only: %i[show], path: '/r' do
    post :join, on: :member
    post :leave, on: :member

    resources :posts, only: %i[show create new], path: '/t' do
      post :upvote, on: :member

      resources :comments, only: %i[create], path: '/c'
    end
  end
end
