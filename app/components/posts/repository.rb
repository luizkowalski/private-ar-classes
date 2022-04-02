# typed: true
# frozen_string_literal: true

module Posts
  class Repository
    extend(T::Sig)

    sig do
      params(user_id: Integer, title: String,
             description: T.nilable(String), community_id: Integer).returns(T::Boolean)
    end
    def create_post(user_id:, title:, description:, community_id:)
      ActiveRecord::Base.transaction do
        PostActiveRecord.create!(
          user_id: user_id,
          title: title,
          description: description,
          community_id: community_id
        )

        true
      end
    end

    sig { params(community_ids: T::Array[Integer]).returns(T::Array[::Post]) }
    def find_posts_by_communities(community_ids:)
      PostActiveRecord.where(community_id: community_ids).
        order(created_at: :desc)
    end

    sig { params(community_id: Integer).returns(T::Array[::Post]) }
    def find_posts_by_community(community_id:)
      find_posts_by_communities(community_ids: [community_id])
    end
  end
end
