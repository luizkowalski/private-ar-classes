# frozen_string_literal: true

class SubredditsController < ApplicationController
  def show
    community = Subreddits::Persistence::Repository.new.find_by_slug(slug: params[:id])
    posts     = Posts::Persistence::Repository.new.find_posts_by_community(community_id: community.id)

    render(Posts::PostComponent.with_collection(posts))
  end
end
