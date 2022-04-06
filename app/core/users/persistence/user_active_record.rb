# typed: true
# frozen_string_literal: true

module Users
  module Persistence
    class UserActiveRecord < ApplicationRecord
      self.table_name = 'users'

      has_secure_password

      def to_entity
        User.new(
          id: T.must(id),
          username: T.must(username)
        )
      end
    end

    private_constant :UserActiveRecord
  end
end
