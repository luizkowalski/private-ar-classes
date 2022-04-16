# frozen_string_literal: true

# == Schema Information
#
# Table name: votes
#
#  id            :bigint           not null, primary key
#  upvote        :boolean          default(TRUE)
#  voteable_type :string           not null
#  created_at    :datetime         not null
#  updated_at    :datetime         not null
#  user_id       :bigint           not null
#  voteable_id   :bigint           not null
#
# Indexes
#
#  index_votes_on_user_id                                    (user_id)
#  index_votes_on_voteable                                   (voteable_type,voteable_id)
#  index_votes_on_voteable_id_and_voteable_type_and_user_id  (voteable_id,voteable_type,user_id) UNIQUE
#
# Foreign Keys
#
#  fk_rails_...  (user_id => users.id)
#
# typed: true

module Subreddits
  module Persistence
    class VoteActiveRecord < ApplicationRecord
      self.table_name = 'votes'

      # belongs_to :user
      belongs_to :voteable, polymorphic: true
    end
  end
end
