# frozen_string_literal: true

module Subreddits
  module Queries
    class FetchPost
      class << self
        def call(post_id:, slug:)
          Subreddits::Persistence::PostActiveRecord.
            select('posts.*, community.title AS community_title, users.username AS username').
            joins('INNER JOIN users ON users.id = posts.user_id').
            joins('LEFT JOIN comments ON comments.post_id = posts.id').
            joins(:community).
            where(community: { title: slug }).
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
            comments_count: post.comments.size,
            created_at: post.created_at
          )
        end
      end
    end
  end
end
