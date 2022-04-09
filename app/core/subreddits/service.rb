# typed: true
# frozen_string_literal: true

module Subreddits
  class Service
    def timeline(user_id:)
      communities = community_repository.communities_by_user(user_id: user_id)
      posts       = community_repository.find_posts_by_communities(slugs: communities.map(&:title))

      enrich_posts_with_username(posts)
    end

    def community_timeline(slug:)
      posts = community_repository.find_posts_by_community(slug: slug)

      enrich_posts_with_username(posts)
    end

    def find_post_by_community_and_id(slug:, id:)
      community_repository.find_post_by_community_and_id(slug: slug, id: id)
    end

    def find_by_slug(slug:)
      community_repository.find_by_slug(slug: slug)
    end

    private

    def community_repository
      @community_repository ||= Persistence::Repository.new
    end

    def find_users_by_ids(user_ids)
      Users::Persistence::Repository.new.find_users_by_ids(user_ids: user_ids.uniq)
    end

    def enrich_posts_with_username(posts)
      user_ids = posts.map(&:user_id).uniq
      users    = find_users_by_ids(user_ids)

      posts.map do |p|
        p.username = users.find { |u| u.id == p.user_id }.username
        p
      end
    end
  end
end
