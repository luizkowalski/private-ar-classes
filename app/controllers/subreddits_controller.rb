# frozen_string_literal: true

class SubredditsController < ApplicationController
  def show
    community = subreddit_service.find_by_slug(slug: params[:id])
    posts     = subreddit_service.community_timeline(slug: community.title)

    render(Posts::PostComponent.with_collection(posts))
  end

  private

  def subreddit_service
    @subreddit_service ||= Subreddits::Service.new
  end
end
