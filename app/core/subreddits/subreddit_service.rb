# typed: true
# frozen_string_literal: true

module Subreddits
  class SubredditService
    def initialize(subreddit_repository: Persistence::SubredditRepository.new,
                   posts_repository: Persistence::PostRepository.new)
      @subreddit_repository = subreddit_repository
      @posts_repository = posts_repository
    end

    def timeline(user_id:)
      communities = subreddit_repository.communities_by_user(user_id: user_id)
      posts       = posts_repository.find_posts_by_communities(slugs: communities.map(&:title))

      enrich_data_with_username(posts)
    end

    def community_timeline(slug:)
      posts = posts_repository.find_posts_by_communities(slugs: [slug])

      enrich_data_with_username(posts)
    end

    def find_by_slug(slug:)
      subreddit_repository.find_by_slug(slug: slug)
    end

    private

    attr_reader :subreddit_repository, :posts_repository

    def find_users_by_ids(user_ids)
      Users::Persistence::Repository.new.find_users_by_ids(user_ids: user_ids)
    end

    def enrich_data_with_username(posts)
      user_ids = posts.map(&:user_id).uniq
      users    = find_users_by_ids(user_ids)

      posts.map do |p|
        users.find { |u| u.id == p.user_id }.then do |user|
          p.username = user.username
          p
        end
      end
    end
  end
end
