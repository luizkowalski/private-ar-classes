# frozen_string_literal: true

class UpvoteComponent < ApplicationComponent
  # `subreddit_id` is kinda not needed because
  # the upvote command fetches the post by id, ignoring the
  # subreddit_id, but we still need one for the URL generation helper to work
  def initialize(post:, subreddit_id: 'tmp')
    @post = post
    @subreddit_id = subreddit_id
  end

  attr_reader :post, :subreddit_id
end
