# typed: true
# frozen_string_literal: true

module Posts
  class Service
    CommunityRepository = Subreddits::Repository
    PostRepository      = Posts::Repository

    def timeline(user_id:)
      communities = user_communities(user_id)

      PostRepository.new.find_posts_by_communities(community_ids: communities.map(&:id)).map do |post|
        ::Post.new(
          id: post.id,
          user_id: post.user_id,
          community: communities.find { |community| community.id == post.community_id }.to_entity,
          title: post.title,
          description: post.description
        )
      end
    end

    private

    def user_communities(user_id)
      @user_communities ||= CommunityRepository.new.communities_by_user(user_id: user_id)
    end
  end
end
