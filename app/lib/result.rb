# typed: true
# frozen_string_literal: true

class Result
  class << self
    extend(T::Sig)

    sig { params(obj: T.untyped).returns(Result) }
    def ok(obj:)
      new(obj:, status: :ok)
    end

    sig { params(obj: T.untyped, exception: T.nilable(StandardError)).returns(Result) }
    def error(obj:, exception: nil)
      new(obj:, exception:, status: :error)
    end
  end

  def initialize(obj:, status:, exception: nil)
    @obj       = obj
    @status    = status
    @exception = exception
  end

  def error?
    status == :error
  end

  def ok?
    status == :ok
  end

  attr_reader :obj, :status, :exception
end
