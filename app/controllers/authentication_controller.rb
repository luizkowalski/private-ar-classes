# frozen_string_literal: true

class AuthenticationController < ApplicationController
  def create
    user = Users::Persistence::UserActiveRecord.find_by(username: params[:username])
    if user&.authenticate(params[:password])
      session[:user_id] = user.id
      redirect_to root_path
    else
      flash[:error] = 'Invalid username or password'
      redirect_to new_authentication_path
    end
  end

  def destroy
    session.delete(:user_id)

    redirect_to new_authentication_path
  end
end
