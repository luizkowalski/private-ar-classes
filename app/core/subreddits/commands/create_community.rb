# frozen_string_literal: true

module Subreddits::Commands
  class CreateCommunity
    class << self
      def call(user_id:, title:, description:)
        community = Subreddits::Persistence::CommunityActiveRecord.create(
          created_by_user_id: user_id,
          title: title,
          description: description
        )
        community.subscriptions.create(user_id: user_id)
      end
    end
  end
end
