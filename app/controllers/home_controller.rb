# frozen_string_literal: true

class HomeController < ApplicationController
  def index
    posts = Subreddits::Service.new.timeline(user_id: 1)

    render(Subreddits::PostPreviewComponent.with_collection(posts))
  end
end
