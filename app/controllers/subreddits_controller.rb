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
    community = Subreddits::Queries::FetchCommunity.call(slug: params[:id])
    Subreddits::Commands::JoinCommunity.call(user_id: current_user.id, slug: params[:id])

    render Subreddits::SubscriptionComponent.new(subscribed: true, subreddit: community)
  end

  def leave
    community = Subreddits::Queries::FetchCommunity.call(slug: params[:id])
    Subreddits::Commands::LeaveCommunity.call(user_id: current_user.id, slug: params[:id])

    render Subreddits::SubscriptionComponent.new(subscribed: false, subreddit: community)
  end
end
