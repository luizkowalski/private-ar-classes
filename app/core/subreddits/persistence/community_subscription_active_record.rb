# frozen_string_literal: true

module Subreddits
  module Persistence
    class CommunitySubscriptionActiveRecord < ApplicationRecord
      self.table_name = 'community_subscriptions'

      belongs_to :community, class_name: 'CommunityActiveRecord'
      # belongs_to :user
    end
  end
end
