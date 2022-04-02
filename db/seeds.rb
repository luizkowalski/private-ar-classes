# frozen_string_literal: true

# Create an user
Users::Repository.new.create(username: 'kowalski', password: 'admin', email: 'email@fake.com')
Users::Repository.new.create(username: 'second_user', password: 'admin', email: 'email2@fake.com')
Users::Repository.new.create(username: 'third_user', password: 'admin', email: 'email3@fake.com')

Subreddits::Repository.new.create_community(
  user_id: 1,
  title: 'nice_mugs',
  description: 'This is a community about nice mugs'
)

Subreddits::Repository.new.subscribe_to_community(
  user_id: 2,
  community_id: 1
)

PostAR = Posts.const_get(:PostActiveRecord)
PostAR.create!(user_id: 1, title: "Welcome to nice mugs y'all", description: 'This is a nice mug', community_id: 1)
