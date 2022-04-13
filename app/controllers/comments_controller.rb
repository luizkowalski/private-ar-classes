# typed: true
# frozen_string_literal: true

class CommentsController < ApplicationController
  def create
    post_id = params[:post_id].to_i
    body    = params[:body]

    post = post_service.find_by_id(id: post_id)
    comment = post_service.comment(user_id: current_user.id, post_id: post.id, body: body)

    respond_to do |format|
      format.json { render json: { success: true, html: render_to_string(Subreddits::CommentComponent.new(comment: comment)) } }
    end
  end

  private

  def post_service
    @post_service ||= Subreddits::PostService.new
  end
end
