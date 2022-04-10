# typed: true
# frozen_string_literal: true

module Subreddits
  class PostService
    extend(T::Sig)

    def initialize(post_repository: Persistence::PostRepository.new)
      @post_repository = post_repository
    end

    sig { params(id: Integer).returns(Post) }
    def find_by_id(id:)
      posts = post_repository.find_by_id(id: id)

      enrich_data_with_username([posts]).first
    end

    sig do
      params(
        user_id: Integer,
        post_id: Integer,
        body: String
      ).returns(T::Boolean)
    end
    def comment(user_id:, post_id:, body:)
      post_repository.comment(user_id: user_id, post_id: post_id, body: body)
    end

    def find_comments_by_post_id(post_id:)
      comments = post_repository.find_comments_by_post_id(post_id: post_id)

      enrich_data_with_username(comments)
    end

    def upvote(user_id:, post_id:)
      post_repository.upvote(user_id: user_id, post_id: post_id)
    end

    private

    attr_reader :post_repository

    def find_users_by_ids(user_ids)
      Users::Persistence::Repository.new.find_users_by_ids(user_ids: user_ids)
    end

    def enrich_data_with_username(data)
      user_ids = data.map(&:user_id).uniq
      users    = find_users_by_ids(user_ids)

      data.map do |p|
        p.username = users.find { |u| u.id == p.user_id }.username
        p
      end
    end
  end
end
