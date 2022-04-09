# frozen_string_literal: true

module Subreddits
  class Post
    attr_reader   :id, :user_id, :community, :title, :body, :created_at, :slug
    attr_accessor :username

    def initialize(id:, user_id:, community:, title:, body:, created_at:, slug:)
      @id         = id
      @user_id    = user_id
      @community  = community
      @title      = title
      @body       = body
      @created_at = created_at
      @slug       = slug
    end
  end
end
