# frozen_string_literal: true

class Post
  attr_reader :id, :user_id, :community, :title, :description

  def initialize(id:, user_id:, community:, title:, description:)
    @id = id
    @user_id = user_id
    @community = community
    @title = title
    @description = description
  end
end
