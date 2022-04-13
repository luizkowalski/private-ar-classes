# frozen_string_literal: true

module Subreddits
  module Queries
    class FetchUserTimeline
      class << self
        def call(user_id:)
          Subreddits::Persistence::PostActiveRecord.
            select('posts.*, communities.title as community_title, user.username as username').
            joins('INNER JOIN users as user ON user.id = posts.user_id').
            joins(community: :subscriptions).
            where(community_subscriptions: { user_id: user_id }).
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
            upvotes: post.upvotes,
            downvotes: post.downvotes,
            created_at: post.created_at
          )
        end
      end
    end
  end
end
