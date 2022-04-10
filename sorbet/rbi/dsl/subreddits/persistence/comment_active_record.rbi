# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for dynamic methods in `Subreddits::Persistence::CommentActiveRecord`.
# Please instead update this file by running `bin/tapioca dsl Subreddits::Persistence::CommentActiveRecord`.

class Subreddits::Persistence::CommentActiveRecord
  include GeneratedAssociationMethods
  include GeneratedAttributeMethods
  extend CommonRelationMethods
  extend GeneratedRelationMethods

  private

  sig { returns(NilClass) }
  def to_ary; end

  module CommonRelationMethods
    sig do
      params(
        block: T.nilable(T.proc.params(record: ::Subreddits::Persistence::CommentActiveRecord).returns(T.untyped))
      ).returns(T::Boolean)
    end
    def any?(&block); end

    sig { params(column_name: T.any(String, Symbol)).returns(T.untyped) }
    def average(column_name); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::Subreddits::Persistence::CommentActiveRecord).void)
      ).returns(::Subreddits::Persistence::CommentActiveRecord)
    end
    def build(attributes = nil, &block); end

    sig { params(operation: Symbol, column_name: T.any(String, Symbol)).returns(T.untyped) }
    def calculate(operation, column_name); end

    sig { params(column_name: T.untyped).returns(T.untyped) }
    def count(column_name = nil); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::Subreddits::Persistence::CommentActiveRecord).void)
      ).returns(::Subreddits::Persistence::CommentActiveRecord)
    end
    def create(attributes = nil, &block); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::Subreddits::Persistence::CommentActiveRecord).void)
      ).returns(::Subreddits::Persistence::CommentActiveRecord)
    end
    def create!(attributes = nil, &block); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::Subreddits::Persistence::CommentActiveRecord).void)
      ).returns(::Subreddits::Persistence::CommentActiveRecord)
    end
    def create_or_find_by(attributes, &block); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::Subreddits::Persistence::CommentActiveRecord).void)
      ).returns(::Subreddits::Persistence::CommentActiveRecord)
    end
    def create_or_find_by!(attributes, &block); end

    sig { returns(T::Array[::Subreddits::Persistence::CommentActiveRecord]) }
    def destroy_all; end

    sig { params(conditions: T.untyped).returns(T::Boolean) }
    def exists?(conditions = :none); end

    sig { returns(T.nilable(::Subreddits::Persistence::CommentActiveRecord)) }
    def fifth; end

    sig { returns(::Subreddits::Persistence::CommentActiveRecord) }
    def fifth!; end

    sig { params(args: T.untyped).returns(T.untyped) }
    def find(*args); end

    sig { params(args: T.untyped).returns(T.nilable(::Subreddits::Persistence::CommentActiveRecord)) }
    def find_by(*args); end

    sig { params(args: T.untyped).returns(::Subreddits::Persistence::CommentActiveRecord) }
    def find_by!(*args); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::Subreddits::Persistence::CommentActiveRecord).void)
      ).returns(::Subreddits::Persistence::CommentActiveRecord)
    end
    def find_or_create_by(attributes, &block); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::Subreddits::Persistence::CommentActiveRecord).void)
      ).returns(::Subreddits::Persistence::CommentActiveRecord)
    end
    def find_or_create_by!(attributes, &block); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::Subreddits::Persistence::CommentActiveRecord).void)
      ).returns(::Subreddits::Persistence::CommentActiveRecord)
    end
    def find_or_initialize_by(attributes, &block); end

    sig { returns(T.nilable(::Subreddits::Persistence::CommentActiveRecord)) }
    def find_sole_by; end

    sig { params(limit: T.untyped).returns(T.untyped) }
    def first(limit = nil); end

    sig { returns(::Subreddits::Persistence::CommentActiveRecord) }
    def first!; end

    sig { returns(T.nilable(::Subreddits::Persistence::CommentActiveRecord)) }
    def forty_two; end

    sig { returns(::Subreddits::Persistence::CommentActiveRecord) }
    def forty_two!; end

    sig { returns(T.nilable(::Subreddits::Persistence::CommentActiveRecord)) }
    def fourth; end

    sig { returns(::Subreddits::Persistence::CommentActiveRecord) }
    def fourth!; end

    sig { returns(Array) }
    def ids; end

    sig { params(record: T.untyped).returns(T::Boolean) }
    def include?(record); end

    sig { params(limit: T.untyped).returns(T.untyped) }
    def last(limit = nil); end

    sig { returns(::Subreddits::Persistence::CommentActiveRecord) }
    def last!; end

    sig do
      params(
        block: T.nilable(T.proc.params(record: ::Subreddits::Persistence::CommentActiveRecord).returns(T.untyped))
      ).returns(T::Boolean)
    end
    def many?(&block); end

    sig { params(column_name: T.any(String, Symbol)).returns(T.untyped) }
    def maximum(column_name); end

    sig { params(record: T.untyped).returns(T::Boolean) }
    def member?(record); end

    sig { params(column_name: T.any(String, Symbol)).returns(T.untyped) }
    def minimum(column_name); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::Subreddits::Persistence::CommentActiveRecord).void)
      ).returns(::Subreddits::Persistence::CommentActiveRecord)
    end
    def new(attributes = nil, &block); end

    sig do
      params(
        block: T.nilable(T.proc.params(record: ::Subreddits::Persistence::CommentActiveRecord).returns(T.untyped))
      ).returns(T::Boolean)
    end
    def none?(&block); end

    sig do
      params(
        block: T.nilable(T.proc.params(record: ::Subreddits::Persistence::CommentActiveRecord).returns(T.untyped))
      ).returns(T::Boolean)
    end
    def one?(&block); end

    sig { params(column_names: T.untyped).returns(T.untyped) }
    def pick(*column_names); end

    sig { params(column_names: T.untyped).returns(T.untyped) }
    def pluck(*column_names); end

    sig { returns(T.nilable(::Subreddits::Persistence::CommentActiveRecord)) }
    def second; end

    sig { returns(::Subreddits::Persistence::CommentActiveRecord) }
    def second!; end

    sig { returns(T.nilable(::Subreddits::Persistence::CommentActiveRecord)) }
    def second_to_last; end

    sig { returns(::Subreddits::Persistence::CommentActiveRecord) }
    def second_to_last!; end

    sig { returns(T.nilable(::Subreddits::Persistence::CommentActiveRecord)) }
    def sole; end

    sig do
      params(
        column_name: T.nilable(T.any(String, Symbol)),
        block: T.nilable(T.proc.params(record: T.untyped).returns(T.untyped))
      ).returns(T.untyped)
    end
    def sum(column_name = nil, &block); end

    sig { params(limit: T.untyped).returns(T.untyped) }
    def take(limit = nil); end

    sig { returns(::Subreddits::Persistence::CommentActiveRecord) }
    def take!; end

    sig { returns(T.nilable(::Subreddits::Persistence::CommentActiveRecord)) }
    def third; end

    sig { returns(::Subreddits::Persistence::CommentActiveRecord) }
    def third!; end

    sig { returns(T.nilable(::Subreddits::Persistence::CommentActiveRecord)) }
    def third_to_last; end

    sig { returns(::Subreddits::Persistence::CommentActiveRecord) }
    def third_to_last!; end
  end

  module GeneratedAssociationMethods
    sig { params(args: T.untyped, blk: T.untyped).returns(::Subreddits::Persistence::PostActiveRecord) }
    def build_post(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(::Subreddits::Persistence::PostActiveRecord) }
    def create_post(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(::Subreddits::Persistence::PostActiveRecord) }
    def create_post!(*args, &blk); end

    sig { returns(T.nilable(::Subreddits::Persistence::PostActiveRecord)) }
    def post; end

    sig { params(value: T.nilable(::Subreddits::Persistence::PostActiveRecord)).void }
    def post=(value); end

    sig { returns(T.nilable(::Subreddits::Persistence::PostActiveRecord)) }
    def reload_post; end
  end

  module GeneratedAssociationRelationMethods
    sig { returns(PrivateAssociationRelation) }
    def all; end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def and(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def annotate(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def create_with(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def distinct(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def eager_load(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def except(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def excluding(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def extending(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def extract_associated(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def from(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def group(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def having(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def in_order_of(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def includes(*args, &blk); end

    sig do
      params(
        attributes: Hash,
        returning: T.nilable(T.any(T::Array[Symbol], FalseClass)),
        unique_by: T.nilable(T.any(T::Array[Symbol], Symbol))
      ).returns(ActiveRecord::Result)
    end
    def insert(attributes, returning: nil, unique_by: nil); end

    sig do
      params(
        attributes: Hash,
        returning: T.nilable(T.any(T::Array[Symbol], FalseClass))
      ).returns(ActiveRecord::Result)
    end
    def insert!(attributes, returning: nil); end

    sig do
      params(
        attributes: T::Array[Hash],
        returning: T.nilable(T.any(T::Array[Symbol], FalseClass)),
        unique_by: T.nilable(T.any(T::Array[Symbol], Symbol))
      ).returns(ActiveRecord::Result)
    end
    def insert_all(attributes, returning: nil, unique_by: nil); end

    sig do
      params(
        attributes: T::Array[Hash],
        returning: T.nilable(T.any(T::Array[Symbol], FalseClass))
      ).returns(ActiveRecord::Result)
    end
    def insert_all!(attributes, returning: nil); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def invert_where(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def joins(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def left_joins(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def left_outer_joins(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def limit(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def lock(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def merge(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def none(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def offset(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def only(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def optimizer_hints(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def or(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def order(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def preload(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def readonly(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def references(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def reorder(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def reselect(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def reverse_order(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def rewhere(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def select(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def strict_loading(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def structurally_compatible?(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def uniq!(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def unscope(*args, &blk); end

    sig do
      params(
        attributes: Hash,
        returning: T.nilable(T.any(T::Array[Symbol], FalseClass)),
        unique_by: T.nilable(T.any(T::Array[Symbol], Symbol))
      ).returns(ActiveRecord::Result)
    end
    def upsert(attributes, returning: nil, unique_by: nil); end

    sig do
      params(
        attributes: T::Array[Hash],
        returning: T.nilable(T.any(T::Array[Symbol], FalseClass)),
        unique_by: T.nilable(T.any(T::Array[Symbol], Symbol))
      ).returns(ActiveRecord::Result)
    end
    def upsert_all(attributes, returning: nil, unique_by: nil); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelationWhereChain) }
    def where(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def without(*args, &blk); end
  end

  module GeneratedAttributeMethods
    sig { returns(::String) }
    def body; end

    sig { params(value: ::String).returns(::String) }
    def body=(value); end

    sig { returns(T::Boolean) }
    def body?; end

    sig { returns(T.nilable(::String)) }
    def body_before_last_save; end

    sig { returns(T.untyped) }
    def body_before_type_cast; end

    sig { returns(T::Boolean) }
    def body_came_from_user?; end

    sig { returns(T.nilable([::String, ::String])) }
    def body_change; end

    sig { returns(T.nilable([::String, ::String])) }
    def body_change_to_be_saved; end

    sig { returns(T::Boolean) }
    def body_changed?; end

    sig { returns(T.nilable(::String)) }
    def body_in_database; end

    sig { returns(T.nilable([::String, ::String])) }
    def body_previous_change; end

    sig { returns(T::Boolean) }
    def body_previously_changed?; end

    sig { returns(T.nilable(::String)) }
    def body_previously_was; end

    sig { returns(T.nilable(::String)) }
    def body_was; end

    sig { void }
    def body_will_change!; end

    sig { returns(T.nilable(::ActiveSupport::TimeWithZone)) }
    def created_at; end

    sig { params(value: ::ActiveSupport::TimeWithZone).returns(::ActiveSupport::TimeWithZone) }
    def created_at=(value); end

    sig { returns(T::Boolean) }
    def created_at?; end

    sig { returns(T.nilable(::ActiveSupport::TimeWithZone)) }
    def created_at_before_last_save; end

    sig { returns(T.untyped) }
    def created_at_before_type_cast; end

    sig { returns(T::Boolean) }
    def created_at_came_from_user?; end

    sig { returns(T.nilable([T.nilable(::ActiveSupport::TimeWithZone), T.nilable(::ActiveSupport::TimeWithZone)])) }
    def created_at_change; end

    sig { returns(T.nilable([T.nilable(::ActiveSupport::TimeWithZone), T.nilable(::ActiveSupport::TimeWithZone)])) }
    def created_at_change_to_be_saved; end

    sig { returns(T::Boolean) }
    def created_at_changed?; end

    sig { returns(T.nilable(::ActiveSupport::TimeWithZone)) }
    def created_at_in_database; end

    sig { returns(T.nilable([T.nilable(::ActiveSupport::TimeWithZone), T.nilable(::ActiveSupport::TimeWithZone)])) }
    def created_at_previous_change; end

    sig { returns(T::Boolean) }
    def created_at_previously_changed?; end

    sig { returns(T.nilable(::ActiveSupport::TimeWithZone)) }
    def created_at_previously_was; end

    sig { returns(T.nilable(::ActiveSupport::TimeWithZone)) }
    def created_at_was; end

    sig { void }
    def created_at_will_change!; end

    sig { returns(T.nilable(::Integer)) }
    def id; end

    sig { params(value: ::Integer).returns(::Integer) }
    def id=(value); end

    sig { returns(T::Boolean) }
    def id?; end

    sig { returns(T.nilable(::Integer)) }
    def id_before_last_save; end

    sig { returns(T.untyped) }
    def id_before_type_cast; end

    sig { returns(T::Boolean) }
    def id_came_from_user?; end

    sig { returns(T.nilable([T.nilable(::Integer), T.nilable(::Integer)])) }
    def id_change; end

    sig { returns(T.nilable([T.nilable(::Integer), T.nilable(::Integer)])) }
    def id_change_to_be_saved; end

    sig { returns(T::Boolean) }
    def id_changed?; end

    sig { returns(T.nilable(::Integer)) }
    def id_in_database; end

    sig { returns(T.nilable([T.nilable(::Integer), T.nilable(::Integer)])) }
    def id_previous_change; end

    sig { returns(T::Boolean) }
    def id_previously_changed?; end

    sig { returns(T.nilable(::Integer)) }
    def id_previously_was; end

    sig { returns(T.nilable(::Integer)) }
    def id_was; end

    sig { void }
    def id_will_change!; end

    sig { returns(::Integer) }
    def post_id; end

    sig { params(value: ::Integer).returns(::Integer) }
    def post_id=(value); end

    sig { returns(T::Boolean) }
    def post_id?; end

    sig { returns(T.nilable(::Integer)) }
    def post_id_before_last_save; end

    sig { returns(T.untyped) }
    def post_id_before_type_cast; end

    sig { returns(T::Boolean) }
    def post_id_came_from_user?; end

    sig { returns(T.nilable([::Integer, ::Integer])) }
    def post_id_change; end

    sig { returns(T.nilable([::Integer, ::Integer])) }
    def post_id_change_to_be_saved; end

    sig { returns(T::Boolean) }
    def post_id_changed?; end

    sig { returns(T.nilable(::Integer)) }
    def post_id_in_database; end

    sig { returns(T.nilable([::Integer, ::Integer])) }
    def post_id_previous_change; end

    sig { returns(T::Boolean) }
    def post_id_previously_changed?; end

    sig { returns(T.nilable(::Integer)) }
    def post_id_previously_was; end

    sig { returns(T.nilable(::Integer)) }
    def post_id_was; end

    sig { void }
    def post_id_will_change!; end

    sig { void }
    def restore_body!; end

    sig { void }
    def restore_created_at!; end

    sig { void }
    def restore_id!; end

    sig { void }
    def restore_post_id!; end

    sig { void }
    def restore_updated_at!; end

    sig { void }
    def restore_user_id!; end

    sig { returns(T.nilable([::String, ::String])) }
    def saved_change_to_body; end

    sig { returns(T::Boolean) }
    def saved_change_to_body?; end

    sig { returns(T.nilable([T.nilable(::ActiveSupport::TimeWithZone), T.nilable(::ActiveSupport::TimeWithZone)])) }
    def saved_change_to_created_at; end

    sig { returns(T::Boolean) }
    def saved_change_to_created_at?; end

    sig { returns(T.nilable([T.nilable(::Integer), T.nilable(::Integer)])) }
    def saved_change_to_id; end

    sig { returns(T::Boolean) }
    def saved_change_to_id?; end

    sig { returns(T.nilable([::Integer, ::Integer])) }
    def saved_change_to_post_id; end

    sig { returns(T::Boolean) }
    def saved_change_to_post_id?; end

    sig { returns(T.nilable([T.nilable(::ActiveSupport::TimeWithZone), T.nilable(::ActiveSupport::TimeWithZone)])) }
    def saved_change_to_updated_at; end

    sig { returns(T::Boolean) }
    def saved_change_to_updated_at?; end

    sig { returns(T.nilable([::Integer, ::Integer])) }
    def saved_change_to_user_id; end

    sig { returns(T::Boolean) }
    def saved_change_to_user_id?; end

    sig { returns(T.nilable(::ActiveSupport::TimeWithZone)) }
    def updated_at; end

    sig { params(value: ::ActiveSupport::TimeWithZone).returns(::ActiveSupport::TimeWithZone) }
    def updated_at=(value); end

    sig { returns(T::Boolean) }
    def updated_at?; end

    sig { returns(T.nilable(::ActiveSupport::TimeWithZone)) }
    def updated_at_before_last_save; end

    sig { returns(T.untyped) }
    def updated_at_before_type_cast; end

    sig { returns(T::Boolean) }
    def updated_at_came_from_user?; end

    sig { returns(T.nilable([T.nilable(::ActiveSupport::TimeWithZone), T.nilable(::ActiveSupport::TimeWithZone)])) }
    def updated_at_change; end

    sig { returns(T.nilable([T.nilable(::ActiveSupport::TimeWithZone), T.nilable(::ActiveSupport::TimeWithZone)])) }
    def updated_at_change_to_be_saved; end

    sig { returns(T::Boolean) }
    def updated_at_changed?; end

    sig { returns(T.nilable(::ActiveSupport::TimeWithZone)) }
    def updated_at_in_database; end

    sig { returns(T.nilable([T.nilable(::ActiveSupport::TimeWithZone), T.nilable(::ActiveSupport::TimeWithZone)])) }
    def updated_at_previous_change; end

    sig { returns(T::Boolean) }
    def updated_at_previously_changed?; end

    sig { returns(T.nilable(::ActiveSupport::TimeWithZone)) }
    def updated_at_previously_was; end

    sig { returns(T.nilable(::ActiveSupport::TimeWithZone)) }
    def updated_at_was; end

    sig { void }
    def updated_at_will_change!; end

    sig { returns(::Integer) }
    def user_id; end

    sig { params(value: ::Integer).returns(::Integer) }
    def user_id=(value); end

    sig { returns(T::Boolean) }
    def user_id?; end

    sig { returns(T.nilable(::Integer)) }
    def user_id_before_last_save; end

    sig { returns(T.untyped) }
    def user_id_before_type_cast; end

    sig { returns(T::Boolean) }
    def user_id_came_from_user?; end

    sig { returns(T.nilable([::Integer, ::Integer])) }
    def user_id_change; end

    sig { returns(T.nilable([::Integer, ::Integer])) }
    def user_id_change_to_be_saved; end

    sig { returns(T::Boolean) }
    def user_id_changed?; end

    sig { returns(T.nilable(::Integer)) }
    def user_id_in_database; end

    sig { returns(T.nilable([::Integer, ::Integer])) }
    def user_id_previous_change; end

    sig { returns(T::Boolean) }
    def user_id_previously_changed?; end

    sig { returns(T.nilable(::Integer)) }
    def user_id_previously_was; end

    sig { returns(T.nilable(::Integer)) }
    def user_id_was; end

    sig { void }
    def user_id_will_change!; end

    sig { returns(T::Boolean) }
    def will_save_change_to_body?; end

    sig { returns(T::Boolean) }
    def will_save_change_to_created_at?; end

    sig { returns(T::Boolean) }
    def will_save_change_to_id?; end

    sig { returns(T::Boolean) }
    def will_save_change_to_post_id?; end

    sig { returns(T::Boolean) }
    def will_save_change_to_updated_at?; end

    sig { returns(T::Boolean) }
    def will_save_change_to_user_id?; end
  end

  module GeneratedRelationMethods
    sig { returns(PrivateRelation) }
    def all; end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def and(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def annotate(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def create_with(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def distinct(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def eager_load(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def except(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def excluding(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def extending(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def extract_associated(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def from(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def group(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def having(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def in_order_of(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def includes(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def invert_where(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def joins(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def left_joins(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def left_outer_joins(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def limit(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def lock(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def merge(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def none(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def offset(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def only(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def optimizer_hints(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def or(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def order(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def preload(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def readonly(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def references(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def reorder(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def reselect(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def reverse_order(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def rewhere(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def select(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def strict_loading(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def structurally_compatible?(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def uniq!(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def unscope(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelationWhereChain) }
    def where(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def without(*args, &blk); end
  end

  class PrivateAssociationRelation < ::ActiveRecord::AssociationRelation
    include CommonRelationMethods
    include GeneratedAssociationRelationMethods

    sig { returns(T::Array[::Subreddits::Persistence::CommentActiveRecord]) }
    def to_ary; end

    Elem = type_member(fixed: ::Subreddits::Persistence::CommentActiveRecord)
  end

  class PrivateAssociationRelationWhereChain < PrivateAssociationRelation
    sig { params(args: T.untyped).returns(PrivateAssociationRelation) }
    def associated(*args); end

    sig { params(args: T.untyped).returns(PrivateAssociationRelation) }
    def missing(*args); end

    sig { params(opts: T.untyped, rest: T.untyped).returns(PrivateAssociationRelation) }
    def not(opts, *rest); end

    Elem = type_member(fixed: ::Subreddits::Persistence::CommentActiveRecord)
  end

  class PrivateCollectionProxy < ::ActiveRecord::Associations::CollectionProxy
    include CommonRelationMethods
    include GeneratedAssociationRelationMethods

    sig do
      params(
        records: T.any(::Subreddits::Persistence::CommentActiveRecord, T::Enumerable[T.any(::Subreddits::Persistence::CommentActiveRecord, T::Enumerable[::Subreddits::Persistence::CommentActiveRecord])])
      ).returns(PrivateCollectionProxy)
    end
    def <<(*records); end

    sig do
      params(
        records: T.any(::Subreddits::Persistence::CommentActiveRecord, T::Enumerable[T.any(::Subreddits::Persistence::CommentActiveRecord, T::Enumerable[::Subreddits::Persistence::CommentActiveRecord])])
      ).returns(PrivateCollectionProxy)
    end
    def append(*records); end

    sig { returns(PrivateCollectionProxy) }
    def clear; end

    sig do
      params(
        records: T.any(::Subreddits::Persistence::CommentActiveRecord, T::Enumerable[T.any(::Subreddits::Persistence::CommentActiveRecord, T::Enumerable[::Subreddits::Persistence::CommentActiveRecord])])
      ).returns(PrivateCollectionProxy)
    end
    def concat(*records); end

    sig do
      params(
        records: T.any(::Subreddits::Persistence::CommentActiveRecord, Integer, String, T::Enumerable[T.any(::Subreddits::Persistence::CommentActiveRecord, Integer, String, T::Enumerable[::Subreddits::Persistence::CommentActiveRecord])])
      ).returns(T::Array[::Subreddits::Persistence::CommentActiveRecord])
    end
    def delete(*records); end

    sig do
      params(
        records: T.any(::Subreddits::Persistence::CommentActiveRecord, Integer, String, T::Enumerable[T.any(::Subreddits::Persistence::CommentActiveRecord, Integer, String, T::Enumerable[::Subreddits::Persistence::CommentActiveRecord])])
      ).returns(T::Array[::Subreddits::Persistence::CommentActiveRecord])
    end
    def destroy(*records); end

    sig { returns(T::Array[::Subreddits::Persistence::CommentActiveRecord]) }
    def load_target; end

    sig do
      params(
        records: T.any(::Subreddits::Persistence::CommentActiveRecord, T::Enumerable[T.any(::Subreddits::Persistence::CommentActiveRecord, T::Enumerable[::Subreddits::Persistence::CommentActiveRecord])])
      ).returns(PrivateCollectionProxy)
    end
    def prepend(*records); end

    sig do
      params(
        records: T.any(::Subreddits::Persistence::CommentActiveRecord, T::Enumerable[T.any(::Subreddits::Persistence::CommentActiveRecord, T::Enumerable[::Subreddits::Persistence::CommentActiveRecord])])
      ).returns(PrivateCollectionProxy)
    end
    def push(*records); end

    sig do
      params(
        other_array: T.any(::Subreddits::Persistence::CommentActiveRecord, T::Enumerable[T.any(::Subreddits::Persistence::CommentActiveRecord, T::Enumerable[::Subreddits::Persistence::CommentActiveRecord])])
      ).returns(T::Array[::Subreddits::Persistence::CommentActiveRecord])
    end
    def replace(other_array); end

    sig { returns(PrivateAssociationRelation) }
    def scope; end

    sig { returns(T::Array[::Subreddits::Persistence::CommentActiveRecord]) }
    def target; end

    sig { returns(T::Array[::Subreddits::Persistence::CommentActiveRecord]) }
    def to_ary; end

    Elem = type_member(fixed: ::Subreddits::Persistence::CommentActiveRecord)
  end

  class PrivateRelation < ::ActiveRecord::Relation
    include CommonRelationMethods
    include GeneratedRelationMethods

    sig { returns(T::Array[::Subreddits::Persistence::CommentActiveRecord]) }
    def to_ary; end

    Elem = type_member(fixed: ::Subreddits::Persistence::CommentActiveRecord)
  end

  class PrivateRelationWhereChain < PrivateRelation
    sig { params(args: T.untyped).returns(PrivateRelation) }
    def associated(*args); end

    sig { params(args: T.untyped).returns(PrivateRelation) }
    def missing(*args); end

    sig { params(opts: T.untyped, rest: T.untyped).returns(PrivateRelation) }
    def not(opts, *rest); end

    Elem = type_member(fixed: ::Subreddits::Persistence::CommentActiveRecord)
  end
end