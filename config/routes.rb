# frozen_string_literal: true

Rails.application.routes.draw do
  root 'home#index'

  resources :subreddits, only: %i[show], path: '/r'
end
