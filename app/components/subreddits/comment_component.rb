# frozen_string_literal: true

class Subreddits::CommentComponent < ApplicationComponent
  def initialize(comment:)
    @comment = comment
  end

  attr_reader :comment
end
