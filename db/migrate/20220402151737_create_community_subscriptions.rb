# frozen_string_literal: true

class CreateCommunitySubscriptions < ActiveRecord::Migration[7.0]
  def change
    create_table :community_subscriptions do |t|
      t.references :community, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true

      t.timestamps
    end

    # TODO: do I need this index or would the search be ok because of the previous foreign keys?
    add_index :community_subscriptions, %i[community_id user_id], unique: true
  end
end
