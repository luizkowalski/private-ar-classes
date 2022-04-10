# frozen_string_literal: true

class CreateVotes < ActiveRecord::Migration[7.0]
  def change
    create_table :votes do |t|
      t.boolean :upvote, default: true
      t.references :user, null: false, foreign_key: true
      t.references :voteable, polymorphic: true, null: false

      t.timestamps
    end

    add_index :votes, %i[voteable_id voteable_type user_id], unique: true
  end
end
