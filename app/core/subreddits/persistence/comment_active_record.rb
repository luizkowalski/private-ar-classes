# frozen_string_literal: true

module Subreddits
  module Persistence
    class CommentActiveRecord < ApplicationRecord
      self.table_name = 'comments'

      belongs_to :post, class_name: 'PostActiveRecord'

      validates :body, presence: true

      def to_entity
        Comment.new(
          id: id,
          post_id: post_id,
          body: body,
          user_id: user_id,
          created_at: created_at
        )
      end
      # belongs_to :user
    end
  end
end
