# frozen_string_literal: true

class PostsController < ApplicationController
  def show
    post_id = params[:id].split('_').first.to_i

    post     = Subreddits::Queries::FetchPost.call(post_id: post_id)
    comments = Subreddits::Queries::FetchCommentsFromPost.call(post_id: post_id)

    render Subreddits::PostComponent.new(post: post, comments: comments)
  end
end
