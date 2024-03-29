# frozen_string_literal: true

module Subreddits
  module Queries
    class FetchCommunityTimeline
      class << self
        def call(slug:)
          Subreddits::Persistence::PostActiveRecord.
            with_all_rich_text.
            select('posts.*, community.title AS community_title, users.username AS username').
            joins('INNER JOIN users ON users.id = posts.user_id').
            eager_load(:comments).
            joins(:community).
            where(community: { title: slug }).
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
