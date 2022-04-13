# frozen_string_literal: true

module Subreddits::Commands
  class CreateComment
    class << self
      def call(post_id:, user_id:, body:)
        Subreddits::Persistence::CommentActiveRecord.create(
          post_id: post_id,
          user_id: user_id,
          body: body
        ).then { |comment| to_entity(comment) }
      end

      private

      def to_entity(comment)
        Subreddits::Comment.new(
          id: comment.id,
          body: comment.body,
          username: '',
          post_id: comment.post_id,
          created_at: comment.created_at
        )
      end
    end
  end
end
