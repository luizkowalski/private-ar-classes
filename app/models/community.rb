# frozen_string_literal: true

  class Community
    attr_reader :id, :title, :description

    def initialize(id:, title:, description:)
      @id = id
      @title = title
      @description = description
    end
  end
