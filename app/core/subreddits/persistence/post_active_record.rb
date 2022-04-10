# typed: true
# frozen_string_literal: true

module Subreddits
  module Persistence
    class PostActiveRecord < ApplicationRecord
      self.table_name = 'posts'

      belongs_to :community, class_name: 'CommunityActiveRecord'
      has_many :comments, class_name: 'CommentActiveRecord'
      has_many :votes, as: :voteable, class_name: 'VoteActiveRecord'

      def to_entity
        Subreddits::Post.new(
          id: id,
          title: title,
          body: body,
          user_id: user_id,
          community: T.must(community).title,
          slug: slug,
          created_at: created_at,
          upvotes: voting_results.upvoted,
          downvotes: voting_results.downvoted
        )
      end

      def voting_results
        @voting_results ||=
          votes.select(
            <<~SQL.squish
              SUM(upvote::integer) AS upvoted,
              SUM(CASE
                    WHEN upvote is true
                    THEN 0
                    ELSE 1
                  END) AS downvoted
            SQL
          ).group_by.first
      end

      def slug
        "#{id}_#{title.parameterize}"
      end
    end
    # private_constant :PostActiveRecord
  end
end
