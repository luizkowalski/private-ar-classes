# frozen_string_literal: true

# == Schema Information
#
# Table name: users
#
#  id              :bigint           not null, primary key
#  email           :string
#  password_digest :text
#  username        :string
#  created_at      :datetime         not null
#  updated_at      :datetime         not null
#
# Indexes
#
#  index_users_on_email     (email) UNIQUE
#  index_users_on_username  (username) UNIQUE
#
# typed: true

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
