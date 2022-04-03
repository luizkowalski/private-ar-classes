# typed: true
# frozen_string_literal: true

module Posts
  class Service
    CommunityRepository = Subreddits::Persistence::Repository
    PostRepository      = Posts::Persistence::Repository

    def timeline(user_id:)
      communities = user_communities(user_id)
      PostRepository.new.find_posts_by_communities(community_ids: communities.map(&:id))
    end

    private

    def user_communities(user_id)
      @user_communities ||= CommunityRepository.new.communities_by_user(user_id: user_id)
    end
  end
end
