# frozen_string_literal: true

# typed: true
module Subreddits
  class PostService
    extend(T::Sig)

    sig { params(slug: String, id: Integer).returns(Post) }
    def find_post_by_community_and_id(slug:, id:)
      posts = community_repository.find_post_by_community_and_id(slug: slug, id: id)

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
      community_repository.comment(user_id: user_id, post_id: post_id, body: body)
    end

    def find_comments_by_post_id(post_id:)
      comments = community_repository.find_comments_by_post_id(post_id: post_id)

      enrich_data_with_username(comments)
    end

    private

    def find_users_by_ids(user_ids)
      Users::Persistence::Repository.new.find_users_by_ids(user_ids: user_ids.uniq)
    end

    def enrich_data_with_username(data)
      user_ids = data.map(&:user_id).uniq
      users    = find_users_by_ids(user_ids)

      data.map do |p|
        p.username = users.find { |u| u.id == p.user_id }.username
        p
      end
    end

    def community_repository
      @community_repository ||= Persistence::Repository.new
    end
  end
end
