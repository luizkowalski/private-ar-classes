# frozen_string_literal: true

module Subreddits::Commands
  class CreateComment
    class << self
      def call(post_id:, user_id:, body:)
        comment = Subreddits::Persistence::CommentActiveRecord.create!(
          post_id:,
          user_id:,
          body:
        )

        to_entity(comment)
      end

      private

      def to_entity(comment)
        Subreddits::Comment.new(
          id: comment.id,
          body: comment.body,
          username: '...', # will be replaced later
          post_id: comment.post_id,
          created_at: comment.created_at
        )
      end
    end
  end
end
