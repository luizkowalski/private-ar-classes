# frozen_string_literal: true

class ApplicationController < ActionController::Base
  def current_user
    Users::User.new(id: 1, username: 'username')
  end

  helper_method :current_user
end
