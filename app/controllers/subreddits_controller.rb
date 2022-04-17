# frozen_string_literal: true

class SubredditsController < ApplicationController
  before_action :authenticate_user!

  def show
    @community  = Subreddits::Queries::FetchCommunity.call(slug: params[:slug])
    @subscribed = Subreddits::Queries::FetchCommunitySubStatus.call(user_id: current_user.id, slug: params[:slug])
    @posts      = Subreddits::Queries::FetchCommunityTimeline.call(slug: params[:slug])
  end

  def join
    Subreddits::Commands::JoinCommunity.call(user_id: current_user.id, slug: params[:slug])
    @community = Subreddits::Queries::FetchCommunity.call(slug: params[:slug])
  end

  def leave
    Subreddits::Commands::LeaveCommunity.call(user_id: current_user.id, slug: params[:slug])
    @community = Subreddits::Queries::FetchCommunity.call(slug: params[:slug])
  end
end
