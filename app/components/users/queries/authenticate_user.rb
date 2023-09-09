# frozen_string_literal: true

module Users::Queries
  class AuthenticateUser
    class << self
      def call(username:, password:)
        user = Users::Persistence::UserActiveRecord.find_by(username:)
        user.id if user&.authenticate(password)
      end
    end
  end
end
