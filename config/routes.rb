# frozen_string_literal: true

Rails.application.routes.draw do
  root 'home#index'

  resource :authentication, only: %i[new create destroy], controller: 'authentication'
  resources :users, only: %i[new create]

  resources :subreddits, only: %i[show], path: '/r', param: :slug do
    post :join, on: :member
    post :leave, on: :member

    resources :posts, only: %i[show create new], path: '/t' do
      post :upvote, on: :member

      resources :comments, only: %i[create index], path: '/c'
    end
  end
end
