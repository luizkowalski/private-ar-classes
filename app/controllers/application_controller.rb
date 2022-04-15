# frozen_string_literal: true

class ApplicationController < ActionController::Base
  def current_user
    @current_user ||= Users::Persistence::UserActiveRecord.find_by(id: session[:user_id])
  end

  def authenticate_user!
    redirect_to new_authentication_path unless user_logged_in?
  end

  def user_logged_in?
    current_user.present?
  end

  helper_method :current_user, :user_logged_in?
end
