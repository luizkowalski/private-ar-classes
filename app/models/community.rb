# frozen_string_literal: true

class Community
  attr_reader :id, :title, :description, :total_subs

  def initialize(id:, title:, description:, total_subs:)
    @id          = id
    @title       = title
    @description = description
    @total_subs  = total_subs
  end
end
