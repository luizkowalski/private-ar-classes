# typed: true
# frozen_string_literal: true

module Subreddits
  module Persistence
    class PostActiveRecord < ApplicationRecord
      self.table_name = 'posts'

      belongs_to :community, class_name: 'CommunityActiveRecord'
      has_many   :comments, class_name: 'CommentActiveRecord'
      has_many   :votes, as: :voteable, class_name: 'VoteActiveRecord'

      def slug
        "#{id}_#{title.parameterize}"
      end
    end
  end
end
