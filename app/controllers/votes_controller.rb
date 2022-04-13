# frozen_string_literal: true

class VotesController < ApplicationController
  def create
    post_id = params[:post_id].to_i

    new_record, success, upvotes = Subreddits::Commands::Upvote.call(
      post_id: post_id,
      user_id: current_user.id
    )

    respond_to do |format|
      format.json { render json: { success: success, new_record: new_record, upvotes: upvotes } }
    end
  end
end
