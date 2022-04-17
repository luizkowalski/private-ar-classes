# frozen_string_literal: true

module Subreddits
  module Queries
    class FetchUserTimeline
      class << self
        def call(user_id:)
          Subreddits::Persistence::PostActiveRecord.
            select('posts.*, communities.title as community_title, users.username as username').
            joins('INNER JOIN users ON users.id = posts.user_id').
            joins(community: :subscriptions).
            eager_load(:comments).
            where(community_subscriptions: { user_id: }).
            order(created_at: :desc).
            map { |post| to_entity(post) }
        end

        private

        def to_entity(post)
          Post.new(
            id: post.id,
            title: post.title,
            body: post.body,
            username: post.username,
            community: post.community_title,
            slug: post.slug,
            comments_count: post.comments.size,
            upvotes: post.upvotes,
            downvotes: post.downvotes,
            created_at: post.created_at
          )
        end
      end
    end
  end
end
