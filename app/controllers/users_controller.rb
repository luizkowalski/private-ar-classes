# frozen_string_literal: true

class UsersController < ApplicationController
  def create
    user_id = Users::Commands::CreateUser.call(username: params[:username], password: params[:password])
    session[:user_id] = user_id

    redirect_to root_path
  end
end
