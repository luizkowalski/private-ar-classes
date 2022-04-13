# frozen_string_literal: true

# == Schema Information
#
# Table name: posts
#
#  id           :bigint           not null, primary key
#  body         :text
#  downvotes    :integer          default(0)
#  title        :string           not null
#  upvotes      :integer          default(0)
#  created_at   :datetime         not null
#  updated_at   :datetime         not null
#  community_id :bigint           not null
#  user_id      :bigint           not null
#
# Indexes
#
#  index_posts_on_community_id  (community_id)
#  index_posts_on_user_id       (user_id)
#
# Foreign Keys
#
#  fk_rails_...  (community_id => communities.id)
#  fk_rails_...  (user_id => users.id)
#

module Subreddits
  module Persistence
    class PostActiveRecord < ApplicationRecord
      self.table_name = 'posts'

      belongs_to :community, class_name: 'CommunityActiveRecord'
      has_many   :comments, class_name: 'CommentActiveRecord'
      has_many   :votes, as: :voteable, class_name: 'VoteActiveRecord'

      def slug
        "#{id}_#{title.parameterize}"
      end
    end
  end
end
