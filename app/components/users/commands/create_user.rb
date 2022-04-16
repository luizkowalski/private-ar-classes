# frozen_string_literal: true

module Users::Commands
  class CreateUser
    class << self
      def call(username:, password:)
        user = Users::Persistence::UserActiveRecord.new(username: username, password: password)
        user.save!
        user.id
      end
    end
  end
end
