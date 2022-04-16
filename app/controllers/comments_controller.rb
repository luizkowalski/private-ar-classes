# typed: true
# frozen_string_literal: true

class CommentsController < ApplicationController
  before_action :authenticate_user!

  def create
    @post_id = params[:post_id].split('_').first.to_i
    body     = params[:body]

    @comment = Subreddits::Commands::CreateComment.call(
      post_id: @post_id,
      user_id: current_user.id,
      body: body
    )
    @post = Subreddits::Queries::FetchPost.call(post_id: @post_id)
  end

  def index
    post_id = params[:post_id].split('_').first.to_i
    comments = Subreddits::Queries::FetchCommentsFromPost.call(post_id: post_id)

    render partial: 'comments/partials/list_comments', locals: { comments: comments }
  end
end
