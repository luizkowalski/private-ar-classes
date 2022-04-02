# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for dynamic methods in `ActiveStorage::Blob`.
# Please instead update this file by running `bin/tapioca dsl ActiveStorage::Blob`.

class ActiveStorage::Blob
  include GeneratedAssociationMethods
  extend CommonRelationMethods
  extend GeneratedRelationMethods

  sig { returns(ActiveStorage::Attached::One) }
  def preview_image; end

  sig { params(attachable: T.untyped).returns(T.untyped) }
  def preview_image=(attachable); end

  private

  sig { returns(NilClass) }
  def to_ary; end

  module CommonRelationMethods
    sig do
      params(
        block: T.nilable(T.proc.params(record: ::ActiveStorage::Blob).returns(T.untyped))
      ).returns(T::Boolean)
    end
    def any?(&block); end

    sig { params(column_name: T.any(String, Symbol)).returns(T.untyped) }
    def average(column_name); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::ActiveStorage::Blob).void)
      ).returns(::ActiveStorage::Blob)
    end
    def build(attributes = nil, &block); end

    sig { params(operation: Symbol, column_name: T.any(String, Symbol)).returns(T.untyped) }
    def calculate(operation, column_name); end

    sig { params(column_name: T.untyped).returns(T.untyped) }
    def count(column_name = nil); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::ActiveStorage::Blob).void)
      ).returns(::ActiveStorage::Blob)
    end
    def create(attributes = nil, &block); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::ActiveStorage::Blob).void)
      ).returns(::ActiveStorage::Blob)
    end
    def create!(attributes = nil, &block); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::ActiveStorage::Blob).void)
      ).returns(::ActiveStorage::Blob)
    end
    def create_or_find_by(attributes, &block); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::ActiveStorage::Blob).void)
      ).returns(::ActiveStorage::Blob)
    end
    def create_or_find_by!(attributes, &block); end

    sig { returns(T::Array[::ActiveStorage::Blob]) }
    def destroy_all; end

    sig { params(conditions: T.untyped).returns(T::Boolean) }
    def exists?(conditions = :none); end

    sig { returns(T.nilable(::ActiveStorage::Blob)) }
    def fifth; end

    sig { returns(::ActiveStorage::Blob) }
    def fifth!; end

    sig { params(args: T.untyped).returns(T.untyped) }
    def find(*args); end

    sig { params(args: T.untyped).returns(T.nilable(::ActiveStorage::Blob)) }
    def find_by(*args); end

    sig { params(args: T.untyped).returns(::ActiveStorage::Blob) }
    def find_by!(*args); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::ActiveStorage::Blob).void)
      ).returns(::ActiveStorage::Blob)
    end
    def find_or_create_by(attributes, &block); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::ActiveStorage::Blob).void)
      ).returns(::ActiveStorage::Blob)
    end
    def find_or_create_by!(attributes, &block); end

    sig do
      params(
        attributes: T.untyped,
        block: T.nilable(T.proc.params(object: ::ActiveStorage::Blob).void)
      ).returns(::ActiveStorage::Blob)
    end
    def find_or_initialize_by(attributes, &block); end

    sig { returns(T.nilable(::ActiveStorage::Blob)) }
    def find_sole_by; end

    sig { params(limit: T.untyped).returns(T.untyped) }
    def first(limit = nil); end

    sig { returns(::ActiveStorage::Blob) }
    def first!; end

    sig { returns(T.nilable(::ActiveStorage::Blob)) }
    def forty_two; end

    sig { returns(::ActiveStorage::Blob) }
    def forty_two!; end

    sig { returns(T.nilable(::ActiveStorage::Blob)) }
    def fourth; end

    sig { returns(::ActiveStorage::Blob) }
    def fourth!; end

    sig { returns(Array) }
    def ids; end

    sig { params(record: T.untyped).returns(T::Boolean) }
    def include?(record); end

    sig { params(limit: T.untyped).returns(T.untyped) }
    def last(limit = nil); end

    sig { returns(::ActiveStorage::Blob) }
    def last!; end

    sig do
      params(
        block: T.nilable(T.proc.params(record: ::ActiveStorage::Blob).returns(T.untyped))
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
        block: T.nilable(T.proc.params(object: ::ActiveStorage::Blob).void)
      ).returns(::ActiveStorage::Blob)
    end
    def new(attributes = nil, &block); end

    sig do
      params(
        block: T.nilable(T.proc.params(record: ::ActiveStorage::Blob).returns(T.untyped))
      ).returns(T::Boolean)
    end
    def none?(&block); end

    sig do
      params(
        block: T.nilable(T.proc.params(record: ::ActiveStorage::Blob).returns(T.untyped))
      ).returns(T::Boolean)
    end
    def one?(&block); end

    sig { params(column_names: T.untyped).returns(T.untyped) }
    def pick(*column_names); end

    sig { params(column_names: T.untyped).returns(T.untyped) }
    def pluck(*column_names); end

    sig { returns(T.nilable(::ActiveStorage::Blob)) }
    def second; end

    sig { returns(::ActiveStorage::Blob) }
    def second!; end

    sig { returns(T.nilable(::ActiveStorage::Blob)) }
    def second_to_last; end

    sig { returns(::ActiveStorage::Blob) }
    def second_to_last!; end

    sig { returns(T.nilable(::ActiveStorage::Blob)) }
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

    sig { returns(::ActiveStorage::Blob) }
    def take!; end

    sig { returns(T.nilable(::ActiveStorage::Blob)) }
    def third; end

    sig { returns(::ActiveStorage::Blob) }
    def third!; end

    sig { returns(T.nilable(::ActiveStorage::Blob)) }
    def third_to_last; end

    sig { returns(::ActiveStorage::Blob) }
    def third_to_last!; end
  end

  module GeneratedAssociationMethods
    sig { returns(T::Array[T.untyped]) }
    def attachment_ids; end

    sig { params(ids: T::Array[T.untyped]).returns(T::Array[T.untyped]) }
    def attachment_ids=(ids); end

    sig { returns(ActiveRecord::Associations::CollectionProxy) }
    def attachments; end

    sig { params(value: T::Enumerable[T.untyped]).void }
    def attachments=(value); end

    sig { params(args: T.untyped, blk: T.untyped).returns(T.untyped) }
    def build_preview_image_attachment(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(T.untyped) }
    def build_preview_image_blob(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(T.untyped) }
    def create_preview_image_attachment(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(T.untyped) }
    def create_preview_image_attachment!(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(T.untyped) }
    def create_preview_image_blob(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(T.untyped) }
    def create_preview_image_blob!(*args, &blk); end

    sig { returns(T.untyped) }
    def preview_image_attachment; end

    sig { params(value: T.untyped).void }
    def preview_image_attachment=(value); end

    sig { returns(T.untyped) }
    def preview_image_blob; end

    sig { params(value: T.untyped).void }
    def preview_image_blob=(value); end

    sig { returns(T.untyped) }
    def reload_preview_image_attachment; end

    sig { returns(T.untyped) }
    def reload_preview_image_blob; end

    sig { returns(T::Array[T.untyped]) }
    def variant_record_ids; end

    sig { params(ids: T::Array[T.untyped]).returns(T::Array[T.untyped]) }
    def variant_record_ids=(ids); end

    sig { returns(ActiveRecord::Associations::CollectionProxy) }
    def variant_records; end

    sig { params(value: T::Enumerable[T.untyped]).void }
    def variant_records=(value); end
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
    def unattached(*args, &blk); end

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
    def with_attached_preview_image(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateAssociationRelation) }
    def without(*args, &blk); end
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
    def unattached(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def uniq!(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def unscope(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelationWhereChain) }
    def where(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def with_attached_preview_image(*args, &blk); end

    sig { params(args: T.untyped, blk: T.untyped).returns(PrivateRelation) }
    def without(*args, &blk); end
  end

  class PrivateAssociationRelation < ::ActiveRecord::AssociationRelation
    include CommonRelationMethods
    include GeneratedAssociationRelationMethods

    sig { returns(T::Array[::ActiveStorage::Blob]) }
    def to_ary; end

    Elem = type_member(fixed: ::ActiveStorage::Blob)
  end

  class PrivateAssociationRelationWhereChain < PrivateAssociationRelation
    sig { params(args: T.untyped).returns(PrivateAssociationRelation) }
    def associated(*args); end

    sig { params(args: T.untyped).returns(PrivateAssociationRelation) }
    def missing(*args); end

    sig { params(opts: T.untyped, rest: T.untyped).returns(PrivateAssociationRelation) }
    def not(opts, *rest); end

    Elem = type_member(fixed: ::ActiveStorage::Blob)
  end

  class PrivateCollectionProxy < ::ActiveRecord::Associations::CollectionProxy
    include CommonRelationMethods
    include GeneratedAssociationRelationMethods

    sig do
      params(
        records: T.any(::ActiveStorage::Blob, T::Enumerable[T.any(::ActiveStorage::Blob, T::Enumerable[::ActiveStorage::Blob])])
      ).returns(PrivateCollectionProxy)
    end
    def <<(*records); end

    sig do
      params(
        records: T.any(::ActiveStorage::Blob, T::Enumerable[T.any(::ActiveStorage::Blob, T::Enumerable[::ActiveStorage::Blob])])
      ).returns(PrivateCollectionProxy)
    end
    def append(*records); end

    sig { returns(PrivateCollectionProxy) }
    def clear; end

    sig do
      params(
        records: T.any(::ActiveStorage::Blob, T::Enumerable[T.any(::ActiveStorage::Blob, T::Enumerable[::ActiveStorage::Blob])])
      ).returns(PrivateCollectionProxy)
    end
    def concat(*records); end

    sig do
      params(
        records: T.any(::ActiveStorage::Blob, Integer, String, T::Enumerable[T.any(::ActiveStorage::Blob, Integer, String, T::Enumerable[::ActiveStorage::Blob])])
      ).returns(T::Array[::ActiveStorage::Blob])
    end
    def delete(*records); end

    sig do
      params(
        records: T.any(::ActiveStorage::Blob, Integer, String, T::Enumerable[T.any(::ActiveStorage::Blob, Integer, String, T::Enumerable[::ActiveStorage::Blob])])
      ).returns(T::Array[::ActiveStorage::Blob])
    end
    def destroy(*records); end

    sig { returns(T::Array[::ActiveStorage::Blob]) }
    def load_target; end

    sig do
      params(
        records: T.any(::ActiveStorage::Blob, T::Enumerable[T.any(::ActiveStorage::Blob, T::Enumerable[::ActiveStorage::Blob])])
      ).returns(PrivateCollectionProxy)
    end
    def prepend(*records); end

    sig do
      params(
        records: T.any(::ActiveStorage::Blob, T::Enumerable[T.any(::ActiveStorage::Blob, T::Enumerable[::ActiveStorage::Blob])])
      ).returns(PrivateCollectionProxy)
    end
    def push(*records); end

    sig do
      params(
        other_array: T.any(::ActiveStorage::Blob, T::Enumerable[T.any(::ActiveStorage::Blob, T::Enumerable[::ActiveStorage::Blob])])
      ).returns(T::Array[::ActiveStorage::Blob])
    end
    def replace(other_array); end

    sig { returns(PrivateAssociationRelation) }
    def scope; end

    sig { returns(T::Array[::ActiveStorage::Blob]) }
    def target; end

    sig { returns(T::Array[::ActiveStorage::Blob]) }
    def to_ary; end

    Elem = type_member(fixed: ::ActiveStorage::Blob)
  end

  class PrivateRelation < ::ActiveRecord::Relation
    include CommonRelationMethods
    include GeneratedRelationMethods

    sig { returns(T::Array[::ActiveStorage::Blob]) }
    def to_ary; end

    Elem = type_member(fixed: ::ActiveStorage::Blob)
  end

  class PrivateRelationWhereChain < PrivateRelation
    sig { params(args: T.untyped).returns(PrivateRelation) }
    def associated(*args); end

    sig { params(args: T.untyped).returns(PrivateRelation) }
    def missing(*args); end

    sig { params(opts: T.untyped, rest: T.untyped).returns(PrivateRelation) }
    def not(opts, *rest); end

    Elem = type_member(fixed: ::ActiveStorage::Blob)
  end
end
