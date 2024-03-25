# frozen_string_literal: true

class SubredditsController < ApplicationController
  before_action :authenticate_user!

  def show
    @community  = Subreddits::Queries::FetchCommunity.call(slug: params[:slug])
    @subscribed = Subreddits::Queries::FetchCommunitySubStatus.call(user_id: current_user.id, slug: params[:slug])
    @posts      = Subreddits::Queries::FetchCommunityTimeline.call(slug: params[:slug])
  end

  def new
    render partial: 'subreddits/partials/form'
  end

  # TODO: Simplify
  def create
    change = Subreddits::Changes::Subreddit.new(
      user_id: current_user.id, title: params[:title], description: params[:description]
    )

    change.on_error do |obj|
      @errors = obj.raw_errors
      return render turbo_stream: turbo_stream.replace('new-community-modal', partial: 'subreddits/partials/form'), status: :bad_request
    end

    result = Subreddits::Commands::CreateCommunity.call(subreddit: change)
    redirect_to subreddit_path(slug: result.obj.title), status: :see_other
  rescue ActiveRecord::RecordInvalid => e
    @errors = e.record.errors.full_messages
    render turbo_stream: turbo_stream.replace('new-community-modal', partial: 'subreddits/partials/form'), status: :bad_request
  end

  def join
    Subreddits::Commands::JoinCommunity.call(user_id: current_user.id, slug: params[:slug])

    redirect_to subreddit_path(slug: params[:slug])
    # @community = Subreddits::Queries::FetchCommunity.call(slug: params[:slug])
  end

  def leave
    Subreddits::Commands::LeaveCommunity.call(user_id: current_user.id, slug: params[:slug])

    redirect_to subreddit_path(slug: params[:slug])

    # @community = Subreddits::Queries::FetchCommunity.call(slug: params[:slug])
  end
end
