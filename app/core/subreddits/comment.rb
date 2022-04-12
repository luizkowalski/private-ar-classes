# frozen_string_literal: true

module Subreddits
  class Comment
    attr_reader :id, :body, :user_id, :post_id, :created_at
    attr_accessor :username

    def initialize(id:, body:, user_id:, post_id:, created_at:)
      @id = id
      @body = body
      @user_id = user_id
      @post_id = post_id
      @created_at = created_at
    end
  end
end
