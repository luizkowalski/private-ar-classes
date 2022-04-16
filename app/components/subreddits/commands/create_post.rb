# frozen_string_literal: true

module Subreddits::Commands
  class CreatePost
    class << self
      def call(subreddit_id:, user_id:, title:, body:)
        post = Subreddits::Persistence::PostActiveRecord.new(
          community_id: subreddit_id,
          user_id: user_id,
          title: title,
          body: body
        )

        [post.save, post.id]
      end

      private

      def to_entity(post)
        Subreddits::Post.new(
          id: post.id,
          title: post.title,
          body: post.body,
          username: post.username,
          community: post.community_title,
          slug: post.slug,
          upvotes: post.upvotes,
          downvotes: post.downvotes,
          comments_count: post.comments.size,
          created_at: post.created_at
        )
      end
    end
  end
end
