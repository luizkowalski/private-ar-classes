# rubocop:disable Performance/StringIdentifierArgument
# frozen_string_literal: true

# Create users
Users::Repository.new.create(username: 'kowalski', password: 'admin', email: 'email@fake.com')
Users::Repository.new.create(username: 'second_user', password: 'admin', email: 'email2@fake.com')
Users::Repository.new.create(username: 'third_user', password: 'admin', email: 'email3@fake.com')

# Create a community
Subreddits::Persistence::Repository.new.create_community(
  user_id: 1,
  title: 'nice_mugs',
  description: 'This is a community about nice mugs'
)

Subreddits::Persistence::Repository.new.create_community(
  user_id: 1,
  title: 'oddly_interesting',
  description: 'Community about things that are oddly interesting'
)

# Subscribe second_user to nice_mugs
Subreddits::Persistence::Repository.new.subscribe_to_community(
  user_id: 2,
  community_id: 1
)

# Create two posts on nice_mugs
PostAR = Posts.const_get('Persistence::PostActiveRecord')
PostAR.create!(user_id: 1, title: "Welcome to nice mugs y'all", body: 'This is a nice mug', community_id: 1)
PostAR.create!(user_id: 2, title: 'Check out this mug you guys', body: 'Thats my newest mug', community_id: 1)

# Create one post on oddly_interesting
PostAR.create!(user_id: 1, title: 'Flytrap catching prey', body: 'really long text', community_id: 2)

# rubocop:enable Performance/StringIdentifierArgument
