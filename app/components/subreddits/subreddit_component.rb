# frozen_string_literal: true

class Subreddits::SubredditComponent < ApplicationComponent
  def initialize(subreddit:, posts:)
    @subreddit = subreddit
    @posts = posts
  end

  attr_reader :subreddit, :posts
end
