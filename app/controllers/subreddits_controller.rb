# frozen_string_literal: true

class SubredditsController < ApplicationController
  def show
    community  = Subreddits::Queries::FetchCommunity.call(slug: params[:id])
    subscribed = Subreddits::Queries::FetchCommunitySubStatus.call(user_id: current_user.id, slug: params[:id])

    Subreddits::Queries::FetchCommunityTimeline.call(slug: params[:id]).then do |posts|
      render(Subreddits::SubredditComponent.new(subreddit: community, posts: posts, subscribed: subscribed))
    end
  end

  def join
    Subreddits::Commands::JoinCommunity.call(user_id: current_user.id, slug: params[:id])

    show
  end

  def leave
    Subreddits::Commands::LeaveCommunity.call(user_id: current_user.id, slug: params[:id])

    show
  end
end
