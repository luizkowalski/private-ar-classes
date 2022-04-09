# typed: true
# frozen_string_literal: true

module Users
  class User
    extend(T::Sig)

    attr_reader :id, :username

    sig { params(id: Integer, username: String).void }
    def initialize(id:, username:)
      @id       = id
      @username = username
    end
  end
end
