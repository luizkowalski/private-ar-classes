# frozen_string_literal: true

module Subreddits
  module Persistence
    class CommentActiveRecord < ApplicationRecord
      self.table_name = 'comments'

      # belongs_to :user
      belongs_to :post, class_name: 'PostActiveRecord'

      validates :body, presence: true
    end
  end
end
