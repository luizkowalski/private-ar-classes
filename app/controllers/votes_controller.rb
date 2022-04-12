# frozen_string_literal: true

class VotesController < ApplicationController
  def create
    post_id      = params[:post_id].to_i
    post_service = Subreddits::PostService.new

    post = post_service.find_by_id(id: post_id)
    new_record, success = post_service.upvote(user_id: current_user.id, post_id: params[:post_id].to_i)

    respond_to do |format|
      format.json { render json: { post: post, new_record: new_record, success: success } }
    end
  end
end
