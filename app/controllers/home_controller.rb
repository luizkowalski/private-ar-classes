# frozen_string_literal: true

class HomeController < ApplicationController
  before_action :authenticate_user!

  def index
    posts = Subreddits::Queries::FetchUserTimeline.call(user_id: current_user.id)

    render(Subreddits::PostPreviewComponent.with_collection(posts))
  end
end
