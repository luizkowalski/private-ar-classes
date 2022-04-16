# frozen_string_literal: true

class PostsController < ApplicationController
  before_action :authenticate_user!

  def create
    subreddit = Subreddits::Queries::FetchCommunity.call(slug: params[:subreddit_id])
    result, id = Subreddits::Commands::CreatePost.call(
      user_id: current_user.id,
      subreddit_id: subreddit.id,
      title: params[:title],
      body: params[:body]
    )

    if result
      redirect_to subreddit_post_path(subreddit_id: subreddit_id, id: id), status: :see_other
    else
      flash[:error] = 'Post could not be created'
      redirect_to new_subreddit_post_path(subreddit_id: subreddit_id), status: :see_other
    end
  end

  def new
    @subreddit_title = subreddit_id
  end

  def show
    @post = Subreddits::Queries::FetchPost.call(post_id: post_id)
  end

  def upvote
    Subreddits::Commands::Upvote.call(user_id: current_user.id, post_id: post_id)

    @post = Subreddits::Queries::FetchPost.call(post_id: post_id)
  end

  private

  def post_id
    @post_id ||= params[:id].split('_').first.to_i
  end

  def subreddit_id
    @subreddit_id ||= params[:subreddit_id]
  end
end
