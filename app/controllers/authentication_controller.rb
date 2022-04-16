# frozen_string_literal: true

class AuthenticationController < ApplicationController
  def create
    Users::Queries::AuthenticateUser.call(username: params[:username], password: params[:password]).then do |user_id|
      if user_id
        session[:user_id] = user_id
        redirect_to root_path
      else
        flash[:error] = 'Invalid username or password'
        redirect_to new_authentication_path
      end
    end
  end

  def destroy
    session.delete(:user_id)

    redirect_to new_authentication_path
  end
end
