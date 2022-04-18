module Subreddits::Changes
  class Subreddit < ApplicationChange
    validates :title, :description, :user_id, presence: true

    attr_reader :title, :description, :user_id

    def initialize(title:, description:, user_id:)
      @title        = title.strip.parameterize.underscore
      @description  = description
      @user_id      = user_id
    end
  end
end
