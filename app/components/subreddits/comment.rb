# frozen_string_literal: true

module Subreddits
  class Comment
    attr_reader :id, :body, :user_id, :created_at, :username, :post_id

    def initialize(id:, body:, username:, created_at:, post_id:)
      @id         = id
      @body       = body
      @post_id    = post_id
      @username   = username
      @created_at = created_at
    end
  end
end
