# frozen_string_literal: true

module Subreddits::Commands
  class LeaveCommunity
    class << self
      def call(user_id:, slug:)
        community = Subreddits::Persistence::CommunityActiveRecord.find_by(title: slug)
        community.subscriptions.where(user_id:).delete_all
        community.update(total_subs: community.subscriptions.count)
      end
    end
  end
end
