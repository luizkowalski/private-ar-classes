# typed: true
# frozen_string_literal: true

module Subreddits
  module Persistence
    class VoteActiveRecord < ApplicationRecord
      self.table_name = 'votes'

      # belongs_to :user
      belongs_to :voteable, polymorphic: true
    end
  end
end
