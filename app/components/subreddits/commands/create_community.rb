# typed: true
# frozen_string_literal: true

module Subreddits::Commands
  class CreateCommunity
    class << self
      extend(T::Sig)

      # TODO: Simplify
      sig { params(subreddit: Subreddits::Changes::Subreddit).returns(Result) }
      def call(subreddit:)
        community = Subreddits::Persistence::CommunityActiveRecord.new(
          created_by_user_id: subreddit.user_id, title: subreddit.title, description: subreddit.description, total_subs: 1
        )

        if community.save!
          community.subscriptions.create!(user_id: subreddit.user_id)

          return Result.ok(obj: community)
        end

        Result.error(obj: community.errors.full_messages)
      end
    end
  end
end
