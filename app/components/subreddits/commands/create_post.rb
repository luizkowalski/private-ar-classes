# typed: true
# frozen_string_literal: true

module Subreddits::Commands
  class CreatePost
    class << self
      extend(T::Sig)

      sig { params(post: Subreddits::Changes::Post).returns(String) }
      def call(post:)
        post = Subreddits::Persistence::PostActiveRecord.create!(
          community_id: post.subreddit_id,
          user_id: post.user_id,
          title: post.title,
          body: post.body
        )

        post.slug
      end
    end
  end
end
