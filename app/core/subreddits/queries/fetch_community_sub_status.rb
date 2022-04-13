# frozen_string_literal: true

module Subreddits::Queries
  class FetchCommunitySubStatus
    class << self
      def call(user_id:, slug:)
        Subreddits::Persistence::CommunitySubscriptionActiveRecord.
          joins(:community).
          exists?(user_id: user_id, communities: { title: slug })
      end
    end
  end
end
