# typed: true
# frozen_string_literal: true

module Subreddits
  module Persistence
    class Repository
      extend(T::Sig)

      sig { params(user_id: Integer, community_id: Integer).returns(T::Boolean) }
      def subscribe_to_community(user_id:, community_id:)
        CommunitySubscriptionActiveRecord.find_or_create_by!(community_id: community_id, user_id: user_id)
        increase_total_subs_by_one(community_id: community_id)

        true
      end

      sig { params(user_id: Integer, title: String, description: String).returns(T::Boolean) }
      def create_community(user_id:, title:, description:)
        ActiveRecord::Base.transaction do
          community = CommunityActiveRecord.create!(
            created_by_user_id: user_id,
            title: title,
            description: description
          )

          subscribe_to_community(user_id: user_id, community_id: T.must(community.id))

          true
        end
      end

      sig { params(slug: String).returns(Community) }
      def find_by_slug(slug:)
        CommunityActiveRecord.find_by(title: slug)&.to_entity
      end

      # sig { params(user_id: Integer).) }
      def communities_by_user(user_id:)
        CommunityActiveRecord.joins(:subscriptions).where(community_subscriptions: { user_id: user_id }).map(&:to_entity)
      end

      sig { params(slugs: T::Array[String]).returns(T::Array[Post]) }
      def find_posts_by_communities(slugs:)
        PostActiveRecord.
          includes(:community).
          where(community: { title: slugs }).
          order(created_at: :desc).map(&:to_entity)
      end

      sig { params(slug: String).returns(T::Array[Post]) }
      def find_posts_by_community(slug:)
        find_posts_by_communities(slugs: [slug])
      end

      private

      sig { params(community_id: Integer).void }
      def increase_total_subs_by_one(community_id:)
        community = CommunityActiveRecord.find(community_id)
        community.update!(total_subs: community.total_subs + 1)
      end
    end
  end
end
