# frozen_string_literal: true

class SubredditsController < ApplicationController
  before_action :authenticate_user!

  def show
    @community  = Subreddits::Queries::FetchCommunity.call(slug: params[:id])
    @subscribed = Subreddits::Queries::FetchCommunitySubStatus.call(user_id: current_user.id, slug: params[:id])
    @posts      = Subreddits::Queries::FetchCommunityTimeline.call(slug: params[:id])
  end

  def join
    @community = Subreddits::Queries::FetchCommunity.call(slug: params[:id])
    Subreddits::Commands::JoinCommunity.call(user_id: current_user.id, slug: params[:id])
  end

  def leave
    @community = Subreddits::Queries::FetchCommunity.call(slug: params[:id])
    Subreddits::Commands::LeaveCommunity.call(user_id: current_user.id, slug: params[:id])
  end
end
