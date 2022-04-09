# frozen_string_literal: true

class Subreddits::PostPreviewComponent < ApplicationComponent
  with_collection_parameter :post

  def initialize(post:)
    @post = post
  end

  attr_reader :post
end
