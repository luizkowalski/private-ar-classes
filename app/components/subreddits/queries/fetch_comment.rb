# frozen_string_literal: true

module Subreddits::Queries
  class FetchComment
    class << self
      def call(id:)
        Subreddits::Persistence::CommentActiveRecord.
          select('comments.*, users.username AS username').
          joins('INNER JOIN users ON users.id = comments.user_id').
          find(id).then { |comment| to_entity(comment) }
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
