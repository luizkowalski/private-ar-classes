# frozen_string_literal: true

class Subreddits::SubscriptionComponent < ApplicationComponent
  def initialize(subscribed:, subreddit:)
    @subscribed = subscribed
    @subreddit = subreddit
  end

  attr_reader :subscribed, :subreddit
end
