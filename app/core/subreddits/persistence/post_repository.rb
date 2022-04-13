# typed: true
# frozen_string_literal: true

module Subreddits
  module Persistence
    class PostRepository
      extend(T::Sig)

      sig { params(id: Integer).returns(T.nilable(Post)) }
      def find_by_id(id:)
        PostActiveRecord.find(id).to_entity
      end

      sig { params(post_id: Integer).returns(T::Hash[Symbol, Integer]) }
      def count_post_votes(post_id:)
        VoteActiveRecord.where(voteable_id: post_id, voteable_type: PostActiveRecord.to_s).
          select(:upvote).group(:upvote).count(:upvote).then do |result|
          result.transform_keys! { |k| k ? :upvotes : :downvotes }
        end
      end

      sig { params(post_id: Integer).returns(T::Array[Comment]) }
      def find_comments_by_post_id(post_id:)
        CommentActiveRecord.where(post_id: post_id).order(created_at: :desc).map(&:to_entity)
      end

      sig { params(user_id: Integer, post_id: Integer).returns(T::Array[T::Boolean]) }
      def upvote(user_id:, post_id:)
        post = PostActiveRecord.find(post_id)
        vote = post.votes.find_or_initialize_by(user_id: user_id)
        new_record = vote.new_record?
        [new_record, vote.update!(upvote: true)]
      end

      sig { params(slugs: T::Array[String]).returns(T::Array[Post]) }
      def find_posts_by_communities(slugs:)
        PostActiveRecord.
          eager_load(:community).
          where(community: { title: slugs }).
          order(created_at: :desc).map(&:to_entity)
      end

      sig { params(user_id: Integer, post_id: Integer, body: String).returns(Comment) }
      def comment(user_id:, post_id:, body:)
        CommentActiveRecord.create!(
          user_id: user_id,
          post_id: post_id,
          body: body
        ).to_entity
      end
    end
  end
end
