# frozen_string_literal: true

class Subreddits::SubredditComponent < ApplicationComponent
  def initialize(subreddit:, posts:, subscribed: nil)
    @subreddit = subreddit
    @posts = posts
    @subscribed = subscribed
  end

  def subscribed_tag_class
    subscribed ? 'tag is-info' : 'tag is-success'
  end

  def subscribed_tag_text
    subscribed ? 'Leave' : 'Join now'
  end

  attr_reader :subreddit, :posts, :subscribed
end
