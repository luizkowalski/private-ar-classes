# typed: true
# frozen_string_literal: true

class CommentsController < ApplicationController
  def create
    post_id = params[:post_id].to_i
    body    = params[:body]

    post_service.comment(user_id: 1, post_id: post_id, body: body)

    redirect_to subreddit_post_path(id: params[:post_id])
  end

  private

  def post_service
    @post_service ||= Subreddits::PostService.new
  end
end
