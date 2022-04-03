# typed: true
# frozen_string_literal: true

module Posts
  module Persistence
    class Repository
      extend(T::Sig)

      sig do
        params(user_id: Integer, title: String,
               body: String, community_id: Integer).returns(T::Boolean)
      end
      def create_post(user_id:, title:, body:, community_id:)
        ActiveRecord::Base.transaction do
          PostActiveRecord.create!(
            user_id: user_id,
            title: title,
            body: body,
            community_id: community_id
          )

          true
        end
      end

      # sig { params(community_ids: T::Array[Integer]).returns(T::Array[::Post]) }
      def find_posts_by_communities(community_ids:)
        columns = ['id', 'title', 'body', 'created_at', 'users.username AS username', 'communities.title AS community']

        PostActiveRecord.select(columns).
          joins('LEFT JOIN users ON users.id = posts.user_id').
          joins('LEFT JOIN communities ON communities.id = posts.community_id').
          where(community_id: community_ids).
          order(created_at: :desc).map(&:to_entity)
      end

      sig { params(community_id: Integer).returns(T::Array[Post]) }
      def find_posts_by_community(community_id:)
        find_posts_by_communities(community_ids: [community_id])
      end
    end
  end
end
