# frozen_string_literal: true

class SubredditsController < ApplicationController
  def show
    posts = Subreddits::Service.new.community_timeline(slug: params[:id])

    render(Posts::PostComponent.with_collection(posts))
  end
end
