# frozen_string_literal: true

module Users
  class UserActiveRecord < ApplicationRecord
    self.table_name = 'users'

    has_secure_password
  end

  private_constant :UserActiveRecord
end
