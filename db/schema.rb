# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.0].define(version: 2022_04_09_215332) do
  create_table "comments", force: :cascade do |t|
    t.integer "post_id", null: false
    t.integer "user_id", null: false
    t.text "body", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["post_id"], name: "index_comments_on_post_id"
    t.index ["user_id"], name: "index_comments_on_user_id"
  end

  create_table "communities", force: :cascade do |t|
    t.string "title"
    t.text "description"
    t.integer "total_subs", default: 0
    t.integer "created_by_user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_by_user_id"], name: "index_communities_on_created_by_user_id"
    t.index ["title"], name: "index_communities_on_title", unique: true
  end

  create_table "community_subscriptions", force: :cascade do |t|
    t.integer "community_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id", "user_id"], name: "index_community_subscriptions_on_community_id_and_user_id", unique: true
    t.index ["community_id"], name: "index_community_subscriptions_on_community_id"
    t.index ["user_id"], name: "index_community_subscriptions_on_user_id"
  end

  create_table "posts", force: :cascade do |t|
    t.integer "community_id", null: false
    t.integer "user_id", null: false
    t.string "title", null: false
    t.text "body"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["community_id"], name: "index_posts_on_community_id"
    t.index ["user_id"], name: "index_posts_on_user_id"
  end

  create_table "users", force: :cascade do |t|
    t.string "username"
    t.string "email"
    t.text "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

  create_table "votes", force: :cascade do |t|
    t.boolean "upvote", default: true
    t.integer "user_id", null: false
    t.string "voteable_type", null: false
    t.integer "voteable_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_votes_on_user_id"
    t.index ["voteable_id", "voteable_type", "user_id"], name: "index_votes_on_voteable_id_and_voteable_type_and_user_id", unique: true
    t.index ["voteable_type", "voteable_id"], name: "index_votes_on_voteable"
  end

  add_foreign_key "comments", "posts"
  add_foreign_key "comments", "users"
  add_foreign_key "communities", "users", column: "created_by_user_id"
  add_foreign_key "community_subscriptions", "communities"
  add_foreign_key "community_subscriptions", "users"
  add_foreign_key "posts", "communities"
  add_foreign_key "posts", "users"
  add_foreign_key "votes", "users"
end
