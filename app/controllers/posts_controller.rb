# frozen_string_literal: true

class PostsController < ApplicationController
  def show
    post_id = params[:id].split('_').first.to_i
    subreddit_id = params[:subreddit_id]

    post     = post_service.find_post_by_community_and_id(slug: subreddit_id, id: post_id)
    comments = post_service.find_comments_by_post_id(post_id: post_id)

    render Subreddits::PostComponent.new(post: post, comments: comments)
  end

  private

  def post_service
    @post_service ||= Subreddits::PostService.new
  end
end
