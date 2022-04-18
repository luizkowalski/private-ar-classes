# frozen_string_literal: true

class ApplicationChange
  include ActiveModel::Validations

  def on_success
    yield(self) if valid?

    self
  end

  def on_error
    yield(self) if invalid?

    self
  end

  def raw_errors
    errors.full_messages
  end

  def error_messages
    errors.full_messages.join(',')
  end
end
