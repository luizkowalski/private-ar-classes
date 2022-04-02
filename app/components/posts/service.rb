# typed: true
# frozen_string_literal: true

module Posts
  class Service
    CommunityRepository = Subreddits::Repository
    PostRepository      = Posts::Repository

    def timeline(user_id:)
      user_communities = CommunityRepository.new.communities_by_user(user_id: user_id)

      PostRepository.new.find_posts_by_communities(community_ids: user_communities.map(&:id)).map do |post|
        Post.new(
          post.id
        )
      end
    end
  end
end
