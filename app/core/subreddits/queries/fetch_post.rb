# frozen_string_literal: true

module Subreddits
  module Queries
    class FetchPost
      class << self
        def call(post_id:)
          Subreddits::Persistence::PostActiveRecord.
            select('posts.*, communities.title AS community_title, users.username AS username').
            joins('INNER JOIN users ON users.id = posts.user_id').
            joins(:community).
            order(created_at: :desc).
            find(post_id).then { |post| to_entity(post) }
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
