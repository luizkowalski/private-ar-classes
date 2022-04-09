# frozen_string_literal: true

Rails.application.routes.draw do
  root 'home#index'

  resources :subreddits, only: %i[show], path: '/r' do
    resources :posts, only: %i[show], path: '/t' do
      resources :comments, only: %i[create], path: '/c'
    end
  end
end
