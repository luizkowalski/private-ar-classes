# frozen_string_literal: true

module Subreddits
  class Post
    attr_reader :id, :username, :community, :title, :body, :created_at, :slug, :upvotes, :downvotes

    def initialize(id:, username:, community:, title:, body:, created_at:, slug:, upvotes:, downvotes:)
      @id         = id
      @username   = username
      @community  = community
      @title      = title
      @body       = body
      @created_at = created_at
      @slug       = slug
      @upvotes    = upvotes
      @downvotes  = downvotes
    end

    def votes
      upvotes.to_i - downvotes.to_i
    end
  end
end
