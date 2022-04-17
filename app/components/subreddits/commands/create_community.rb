# typed: true
# frozen_string_literal: true

module Subreddits::Commands
  class CreateCommunity
    class << self
      extend(T::Sig)

      sig { params(user_id: Integer, title: String, description: String).returns(Subreddits::Community) }
      def call(user_id:, title:, description:)
        community = Subreddits::Persistence::CommunityActiveRecord.create(
          created_by_user_id: user_id, title:, description:
        ).tap { |comm| comm.subscriptions.create(user_id:) }

        Subreddits::Community.new(
          id: community.id,
          title: community.title,
          description: community.description,
          total_subs: 1
        )
      end
    end
  end
end
