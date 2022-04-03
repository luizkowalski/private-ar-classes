# frozen_string_literal: true

class Posts::PostComponent < ApplicationComponent
  def initialize(post:)
    @post = post
  end

  attr_reader :post
end
