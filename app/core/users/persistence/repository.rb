# typed: true
# frozen_string_literal: true

module Users
  module Persistence
    class Repository
      extend(T::Sig)

      sig { params(username: String, password: String, email: String).returns(T::Boolean) }
      def create(username:, password:, email:)
        user = UserActiveRecord.new(username: username, password: password, email: email)

        return false if user.invalid?

        user.save!

        true
      end

      sig { params(user_ids: T::Array[Integer]).returns(T::Array[User]) }
      def find_users_by_ids(user_ids:)
        UserActiveRecord.select(:id, :username).where(id: user_ids).map(&:to_entity)
      end

      sig { params(username: String).returns(T.nilable(UserActiveRecord)) }
      def find_by_username(username:)
        UserActiveRecord.find_by(username: username)&.to_entity
      end
    end
  end
end
