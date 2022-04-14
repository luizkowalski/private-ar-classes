# frozen_string_literal: true

module Subreddits::Commands
  class Upvote
    class << self
      def call(user_id:, post_id:)
        ActiveRecord::Base.transaction do
          vote = Subreddits::Persistence::VoteActiveRecord.find_or_initialize_by(
            user_id: user_id,
            voteable_id: post_id,
            voteable_type: 'Subreddits::Persistence::PostActiveRecord'
          )

          upvotes = increase_post_score(post_id, vote.new_record?)

          [vote.new_record?, vote.update(upvote: true), upvotes]
        end
      end

      private

      # TODO: tallying the score is a lock-step process,
      # we should avoid doing it here and move the tallying process to a background job
      def increase_post_score(post_id, new_record)
        post = Subreddits::Persistence::PostActiveRecord.lock.find(post_id)

        return post.upvotes unless new_record

        new_upvotes = post.upvotes + 1
        post.update(upvotes: new_upvotes)

        new_upvotes
      end
    end
  end
end
