# typed: true
# frozen_string_literal: true

module Users
  class Repository
    extend(T::Sig)

    sig { params(username: String, password: String, email: String).returns(T::Boolean) }
    def create(username:, password:, email:)
      user = UserActiveRecord.new(username: username, password: password, email: email)

      return false if user.invalid?

      user.save!

      true
    end

    sig { params(username: String).returns(T.nilable(UserActiveRecord)) }
    def find_by_username(username:)
      UserActiveRecord.find_by(username: username)
    end
  end
end
