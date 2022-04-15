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
      redirect_to subreddit_post_path(subreddit_id: subreddit.title, id: id), status: :see_other
    else
      flash[:error] = 'Post could not be created'
      redirect_to new_subreddit_post_path(subreddit_id: subreddit.title), status: :see_other
    end
  end

  def new
    @subreddit_title = params[:subreddit_id]
  end

  def show
    post_id = params[:id].split('_').first.to_i

    post     = Subreddits::Queries::FetchPost.call(post_id: post_id)
    comments = Subreddits::Queries::FetchCommentsFromPost.call(post_id: post_id)

    render Subreddits::PostComponent.new(post: post, comments: comments)
  end

  def upvote
    post_id = params[:id].split('_').first.to_i

    Subreddits::Commands::Upvote.call(user_id: current_user.id, post_id: post_id)

    render UpvoteComponent.new(post: Subreddits::Queries::FetchPost.call(post_id: post_id))
  end
end
