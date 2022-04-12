# frozen_string_literal: true

class VotesController < ApplicationController
  def create
    post_id = params[:post_id].to_i
    post_service = Subreddits::PostService.new

    post = post_service.find_by_id(id: post_id)
    post_service.upvote(user_id: current_user.id, post_id: params[:post_id])

    redirect_to subreddit_post_path(id: post.slug)
  end
end
