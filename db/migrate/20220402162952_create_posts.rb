# frozen_string_literal: true

class CreatePosts < ActiveRecord::Migration[7.0]
  def change
    create_table :posts do |t|
      t.references :community, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.string     :title, null: false
      t.integer    :upvotes, default: 0
      t.integer    :downvotes, default: 0
      t.text       :body

      t.timestamps
    end
  end
end
