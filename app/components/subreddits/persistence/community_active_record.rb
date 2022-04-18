# frozen_string_literal: true

# == Schema Information
#
# Table name: communities
#
#  id                 :bigint           not null, primary key
#  description        :text
#  title              :string
#  total_subs         :integer          default(0)
#  created_at         :datetime         not null
#  updated_at         :datetime         not null
#  created_by_user_id :bigint           not null
#
# Indexes
#
#  index_communities_on_created_by_user_id  (created_by_user_id)
#  index_communities_on_title               (title) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (created_by_user_id => users.id)
#
module Subreddits
  module Persistence
    class CommunityActiveRecord < ApplicationRecord
      self.table_name = 'communities'

      validates :title, presence: true, uniqueness: true
      validates :description, presence: true

      has_many :subscriptions, class_name: 'CommunitySubscriptionActiveRecord', foreign_key: 'community_id'
    end
  end
end
