# typed: true
# frozen_string_literal: true

module Users::Commands
  class CreateUser
    class << self
      extend(T::Sig)
      sig { params(username: String, password: String).returns(Integer) }
      def call(username:, password:)
        user = Users::Persistence::UserActiveRecord.new(username:, password:)
        user.save!

        T.must(user.id)
      end
    end
  end
end
