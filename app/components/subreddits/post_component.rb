# frozen_string_literal: true

class Subreddits::PostComponent < ApplicationComponent
  def initialize(post:, comments:)
    @post = post
    @comments = comments
  end

  attr_reader :post, :comments
end
