# frozen_string_literal: true

Rails.application.routes.draw do
  root 'home#index'

  resources :subreddits, only: %i[show], path: '/r' do
    post :join, on: :member
    post :leave, on: :member

    resources :posts, only: %i[show], path: '/t' do
      post :upvote, on: :member

      resources :comments, only: %i[create], path: '/c'
    end
  end
end
