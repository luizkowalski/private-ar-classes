# frozen_string_literal: true

module Subreddits::Changes
  class Post < ::Change
    attr_reader :subreddit_id, :user_id, :title, :body

    validates :subreddit_id, :user_id, :title, presence: true

    def initialize(subreddit_id:, user_id:, title:, body:)
      @subreddit_id = subreddit_id
      @user_id      = user_id
      @title        = title
      @body         = body
    end
  end
end
