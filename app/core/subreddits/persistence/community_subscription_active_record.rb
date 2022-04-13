# frozen_string_literal: true

# == Schema Information
#
# Table name: community_subscriptions
#
#  id           :bigint           not null, primary key
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  community_id :bigint           not null
#  user_id      :bigint           not null
#
# Indexes
#
#  index_community_subscriptions_on_community_id              (community_id)
#  index_community_subscriptions_on_community_id_and_user_id  (community_id,user_id) UNIQUE
#  index_community_subscriptions_on_user_id                   (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (community_id => communities.id)
#  fk_rails_...  (user_id => users.id)
#
module Subreddits
  module Persistence
    class CommunitySubscriptionActiveRecord < ApplicationRecord
      self.table_name = 'community_subscriptions'

      belongs_to :community, class_name: 'CommunityActiveRecord'
      # belongs_to :user
    end
  end
end
