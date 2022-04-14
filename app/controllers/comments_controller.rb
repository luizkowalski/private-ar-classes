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

    post     = Subreddits::Queries::FetchPost.call(post_id: post_id)
    comments = Subreddits::Queries::FetchCommentsFromPost.call(post_id: post_id)

    render Subreddits::PostComponent.new(post: post, comments: comments)
  end
end
