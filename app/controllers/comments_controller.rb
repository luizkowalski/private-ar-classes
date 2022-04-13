# typed: true
# frozen_string_literal: true

class CommentsController < ApplicationController
  def create
    post_id = params[:post_id].to_i
    body    = params[:body]

    Subreddits::Commands::CreateComment.call(
      post_id: post_id,
      user_id: current_user.id,
      body: body
    )

    redirect_to subreddit_post_path(id: post_id)
  end
end
