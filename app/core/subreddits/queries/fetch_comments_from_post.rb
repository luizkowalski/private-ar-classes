# frozen_string_literal: true

module Subreddits::Queries
  class FetchCommentsFromPost
    class << self
      def call(post_id:)
        Subreddits::Persistence::CommentActiveRecord.
          select('comments.*, users.username AS username').
          joins('INNER JOIN users ON users.id = comments.user_id').
          where(post_id: post_id).
          order(created_at: :desc).
          map { |comment| to_entity(comment) }
      end

      private

      def to_entity(comment)
        Subreddits::Comment.new(
          id: comment.id,
          body: comment.body,
          username: comment.username,
          post_id: comment.post_id,
          created_at: comment.created_at
        )
      end
    end
  end
end
