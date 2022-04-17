# typed: true
# frozen_string_literal: true

class PostsController < ApplicationController
  before_action :authenticate_user!

  def create
    change = Subreddits::Changes::Post.new(
      user_id: current_user.id,
      subreddit_id: subreddit.id,
      title: params[:title],
      body: params[:body]
    )

    change.on_error do |obj|
      flash[:error] = obj.error_messages
      redirect_to new_subreddit_post_path(subreddit_id:), status: :see_other
    end

    change.on_success do |obj|
      Subreddits::Commands::CreatePost.call(post: obj).then do |slug|
        redirect_to subreddit_post_path(subreddit_id:, id: slug), status: :see_other
      end
    end
  end

  def new
    @subreddit_title = subreddit_id
  end

  def show
    @post = Subreddits::Queries::FetchPost.call(post_id:)
  end

  def upvote
    Subreddits::Commands::Upvote.call(user_id: current_user.id, post_id:)

    @post = Subreddits::Queries::FetchPost.call(post_id:)
  end

  private

  def post_id
    @post_id ||= params[:id].split('_').first.to_i
  end

  def subreddit_id
    @subreddit_id ||= params[:subreddit_id]
  end

  def subreddit
    @subreddit = Subreddits::Queries::FetchCommunity.call(slug: params[:subreddit_id])
  end
end
