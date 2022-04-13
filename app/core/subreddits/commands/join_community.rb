# frozen_string_literal: true

module Subreddits::Commands
  class JoinCommunity
    class << self
      def call(user_id:, slug:)
        community = Subreddits::Persistence::CommunityActiveRecord.find_by(title: slug)
        community.subscriptions.create(user_id: user_id)
      end
    end
  end
end
