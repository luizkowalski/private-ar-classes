# frozen_string_literal: true

module Posts
  class PostActiveRecord < ApplicationRecord
    self.table_name = 'posts'

    # belongs_to :community
    # belongs_to :user
  end
  private_constant :PostActiveRecord
end
