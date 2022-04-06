# typed: true
# frozen_string_literal: true

module Subreddits
  class Service
    def timeline(user_id:)
      communities = community_repository.communities_by_user(user_id: user_id)
      posts       = community_repository.find_posts_by_communities(community_ids: communities.map(&:id))

      enrich_posts_with_username(posts)
    end

    def community_timeline(slug:)
      community = community_repository.find_by_slug(slug: slug)
      posts     = community_repository.find_posts_by_community(community_id: community.id)

      enrich_posts_with_username(posts)
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
