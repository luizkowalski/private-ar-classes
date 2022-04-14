# typed: true
# frozen_string_literal: true

class CommentsController < ApplicationController
  def create
    post_id = params[:post_id].split('_').first.to_i
    body    = params[:body]

    Subreddits::Commands::CreateComment.call(
      post_id: post_id,
      user_id: current_user.id,
      body: body
    )

    redirect_to subreddit_post_path(subreddit_id: params[:subreddit_id], id: params[:post_id]), status: :see_other
    # render Subreddits::PostComponent.new(post: post, comments: comments)
  end
end
