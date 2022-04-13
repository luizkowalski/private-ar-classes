# frozen_string_literal: true

module Subreddits
  module Persistence
    class CommunityActiveRecord < ApplicationRecord
      self.table_name = 'communities'

      has_many :subscriptions, class_name: 'CommunitySubscriptionActiveRecord', foreign_key: 'community_id'
    end
  end
end
