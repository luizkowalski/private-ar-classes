# frozen_string_literal: true

module Posts
  module Persistence
    class PostActiveRecord < ApplicationRecord
      self.table_name = 'posts'

      # belongs_to :community
      # belongs_to :user

      def to_entity
        Posts::Post.new(
          id: id,
          title: title,
          body: body,
          username: username,
          community: community,
          created_at: created_at
        )
      end
    end
    private_constant :PostActiveRecord
  end
end
