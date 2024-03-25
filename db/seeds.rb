# frozen_string_literal: true

# Create users
user_repository = Users::Persistence::Repository.new

user_repository.create(username: 'kowalski', password: 'admin', email: 'email@fake.com')
user_repository.create(username: 'second_user', password: 'admin', email: 'email2@fake.com')
user_repository.create(username: 'third_user', password: 'admin', email: 'email3@fake.com')

# Create a community
Subreddits::Commands::CreateCommunity.call(
  Subreddits::Changes::Subreddit.new(
    user_id: 1,
    title: 'nice_mugs',
    description: 'This is a community about nice mugs'
  )
)

Subreddits::Commands::CreateCommunity.call(
  user_id: 1,
  title: 'oddly_interesting',
  description: 'Community about things that are oddly interesting'
)

Subreddits::Commands::CreateCommunity.call(
  user_id: 2,
  title: 'antiwork',
  description: 'Man, I hate working'
)
# # Subscribe second_user to nice_mugs
# Subreddits::Commands::CreateCommunity.new.subscribe_to_community(
#   user_id: 2,
#   community_id: 1
# )

# Create two posts on nice_mugs
PostAR = Subreddits.const_get('Persistence::PostActiveRecord')
PostAR.create!(user_id: 1, title: "Welcome to nice mugs y'all", body: 'This is a nice mug', community_id: 1)
PostAR.create!(user_id: 2, title: 'Check out this mug you guys', body: 'Thats my newest mug', community_id: 1)

# Create one post on oddly_interesting
PostAR.create!(user_id: 1, title: 'Flytrap catching prey', body: 'really long text', community_id: 2)

PostAR.create!(user_id: 1, title: 'Welcome to r/antiwork', body: 'really long text', community_id: 3)

Comment = Subreddits.const_get('Persistence::CommentActiveRecord')
Comment.create!(user_id: 2, post_id: 2, body: 'Long post body')
Comment.create!(user_id: 3, post_id: 2, body: 'Long post body')
