# typed: true
# frozen_string_literal: true

module Subreddits
  module Persistence
    class PostActiveRecord < ApplicationRecord
      self.table_name = 'posts'

      belongs_to :community, class_name: 'CommunityActiveRecord'

      def to_entity
        Subreddits::Post.new(
          id: id,
          title: title,
          body: body,
          user_id: user_id,
          community: T.must(community).title,
          slug: slug,
          created_at: created_at
        )
      end

      def slug
        "#{id}_#{title.parameterize}"
      end
    end
    # private_constant :PostActiveRecord
  end
end
