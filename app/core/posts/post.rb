# frozen_string_literal: true

module Posts
  class Post
    attr_reader :id, :username, :community, :title, :body, :created_at

    def initialize(id:, username:, community:, title:, body:, created_at:)
      @id         = id
      @username   = username
      @community  = community
      @title      = title
      @body       = body
      @created_at = created_at
    end
  end
end
