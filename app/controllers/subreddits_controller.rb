# frozen_string_literal: true

class SubredditsController < ApplicationController
  def show
    community = Subreddits::Queries::FetchCommunity.call(slug: params[:id])

    Subreddits::Queries::FetchCommunityTimeline.call(slug: params[:id]).then do |posts|
      render(Subreddits::SubredditComponent.new(subreddit: community, posts: posts))
    end
  end
end
