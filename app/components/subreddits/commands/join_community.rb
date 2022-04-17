# frozen_string_literal: true

module Subreddits::Commands
  class JoinCommunity
    class << self
      def call(user_id:, slug:)
        community = Subreddits::Persistence::CommunityActiveRecord.find_by(title: slug)
        community.subscriptions.create(user_id:)
        community.update(total_subs: community.subscriptions.count)
      end
    end
  end
end
