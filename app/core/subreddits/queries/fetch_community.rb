# frozen_string_literal: true

module Subreddits::Queries
  class FetchCommunity
    class << self
      def call(slug:)
        Subreddits::Persistence::CommunityActiveRecord.
          find_by(title: slug).then { |community| to_entity(community) }
      end

      private

      def to_entity(community)
        Subreddits::Community.new(
          id: community.id,
          title: community.title,
          description: community.description,
          total_subs: community.total_subs
        )
      end
    end
  end
end
