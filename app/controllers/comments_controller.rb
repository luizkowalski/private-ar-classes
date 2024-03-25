# typed: true
# frozen_string_literal: true

class CommentsController < ApplicationController
  before_action :authenticate_user!

  def index
    comments = Subreddits::Queries::FetchCommentsFromPost.call(post_id:)

    render partial: 'comments/partials/lazy_loaded_comments', locals: { comments: }
  end

  def create
    comment = Subreddits::Commands::CreateComment.call(
      post_id:,
      user_id: current_user.id,
      body: params[:body]
    )

    redirect_to subreddit_post_path(subreddit_slug, post_id)

    # # Reload the comment so we can get the username
    # @comment = Subreddits::Queries::FetchComment.call(id: comment.id)
    # @post    = Subreddits::Queries::FetchPost.call(post_id:, slug: subreddit_slug)
  end

  private

  def post_id
    @post_id ||= params[:post_id].split('_').first.to_i
  end

  def subreddit_slug
    @subreddit_slug ||= params[:subreddit_slug]
  end
end
