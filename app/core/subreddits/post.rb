# frozen_string_literal: true

module Subreddits
  class Post
    attr_reader   :id, :user_id, :community, :title, :body, :created_at, :slug, :upvotes, :downvotes
    attr_accessor :username

    def initialize(id:, user_id:, community:, title:, body:, created_at:, slug:, upvotes:, downvotes:)
      @id         = id
      @user_id    = user_id
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
