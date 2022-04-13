# typed: true
# frozen_string_literal: true

module Subreddits
  module Persistence
    class PostActiveRecord < ApplicationRecord
      self.table_name = 'posts'

      belongs_to :community, class_name: 'CommunityActiveRecord'
      has_many   :comments, class_name: 'CommentActiveRecord'
      has_many   :votes, as: :voteable, class_name: 'VoteActiveRecord'

      def to_entity
        Subreddits::Post.new(
          id: id,
          title: title,
          body: body,
          user_id: user_id,
          community: T.must(community).title,
          slug: slug,
          upvotes: count_votes[:upvotes],
          downvotes: count_votes[:downvotes],
          created_at: created_at
        )
      end

      # TODO: Too much happening here...
      def count_votes
        { upvotes: 0, downvotes: 0 }
        # @count_votes ||= votes.select(:upvote).group(:upvote).count(:upvote).then do |result|
        #   result.transform_keys! { |k| k ? :upvotes : :downvotes }
        # end
      end

      def slug
        "#{id}_#{title.parameterize}"
      end
    end
    private_constant :PostActiveRecord
  end
end
