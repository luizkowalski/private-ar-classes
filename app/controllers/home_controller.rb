# frozen_string_literal: true

class HomeController < ApplicationController
  def index
    @posts = Posts::Service.new.timeline user_id: 1
  end
end
