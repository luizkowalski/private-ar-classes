# frozen_string_literal: true

class SubredditsController < ApplicationController
  def show
    community = subreddit_service.find_by_slug(slug: params[:id])

    subreddit_service.community_timeline(slug: params[:id]).then do |posts|
      render(Subreddits::SubredditComponent.new(subreddit: community, posts: posts))
    end
  end

  private

  def subreddit_service
    @subreddit_service ||= Subreddits::SubredditService.new
  end

  def post_service
    @post_service ||= Subreddits::PostService.new
  end
end
