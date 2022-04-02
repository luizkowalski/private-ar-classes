# frozen_string_literal: true

module Subreddits
  class CommunityActiveRecord < ApplicationRecord
    self.table_name = 'communities'

    has_many :subscriptions, class_name: 'CommunitySubscriptionActiveRecord', foreign_key: 'community_id'

    def to_entity
      Community.new(
        id: id,
        title: title,
        description: description,
        total_subs: total_subs
      )
    end
  end
  private_constant :CommunityActiveRecord
end
