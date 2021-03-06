# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for types exported from the `ruby-vips` gem.
# Please instead update this file by running `bin/tapioca gem ruby-vips`.

module GLib
  extend ::FFI::Library

  def g_free(*_arg0); end
  def g_log_remove_handler(*_arg0); end
  def g_log_set_handler(*_arg0); end
  def g_malloc(*_arg0); end

  class << self
    def g_free(*_arg0); end
    def g_log_remove_handler(*_arg0); end
    def g_log_set_handler(*_arg0); end
    def g_malloc(*_arg0); end
    def logger; end
    def logger=(_arg0); end
    def remove_log_handler; end
    def set_log_domain(domain); end
  end
end

GLib::GLIB_TO_SEVERITY = T.let(T.unsafe(nil), Hash)
GLib::G_FREE = T.let(T.unsafe(nil), FFI::Function)
GLib::LOG_FLAG_FATAL = T.let(T.unsafe(nil), Integer)
GLib::LOG_FLAG_RECURSION = T.let(T.unsafe(nil), Integer)
GLib::LOG_HANDLER = T.let(T.unsafe(nil), Proc)
GLib::LOG_LEVEL_CRITICAL = T.let(T.unsafe(nil), Integer)
GLib::LOG_LEVEL_DEBUG = T.let(T.unsafe(nil), Integer)
GLib::LOG_LEVEL_ERROR = T.let(T.unsafe(nil), Integer)
GLib::LOG_LEVEL_INFO = T.let(T.unsafe(nil), Integer)
GLib::LOG_LEVEL_MESSAGE = T.let(T.unsafe(nil), Integer)
GLib::LOG_LEVEL_WARNING = T.let(T.unsafe(nil), Integer)

module GObject
  extend ::FFI::Library

  def g_object_get_property(*_arg0); end
  def g_object_ref(*_arg0); end
  def g_object_set_property(*_arg0); end
  def g_object_unref(*_arg0); end
  def g_param_spec_get_blurb(*_arg0); end
  def g_signal_connect_data(*_arg0); end
  def g_type_from_name(*_arg0); end
  def g_type_fundamental(*_arg0); end
  def g_type_init(*_arg0); end
  def g_type_name(*_arg0); end
  def g_value_get_boolean(*_arg0); end
  def g_value_get_double(*_arg0); end
  def g_value_get_enum(*_arg0); end
  def g_value_get_flags(*_arg0); end
  def g_value_get_int(*_arg0); end
  def g_value_get_object(*_arg0); end
  def g_value_get_string(*_arg0); end
  def g_value_get_uint64(*_arg0); end
  def g_value_init(*_arg0); end
  def g_value_set_boolean(*_arg0); end
  def g_value_set_double(*_arg0); end
  def g_value_set_enum(*_arg0); end
  def g_value_set_flags(*_arg0); end
  def g_value_set_int(*_arg0); end
  def g_value_set_object(*_arg0); end
  def g_value_set_string(*_arg0); end
  def g_value_set_uint64(*_arg0); end
  def g_value_unset(*_arg0); end

  class << self
    def g_object_get_property(*_arg0); end
    def g_object_ref(*_arg0); end
    def g_object_set_property(*_arg0); end
    def g_object_unref(*_arg0); end
    def g_param_spec_get_blurb(*_arg0); end
    def g_signal_connect_data(*_arg0); end
    def g_type_from_name(*_arg0); end
    def g_type_fundamental(*_arg0); end
    def g_type_init(*_arg0); end
    def g_type_name(*_arg0); end
    def g_value_get_boolean(*_arg0); end
    def g_value_get_double(*_arg0); end
    def g_value_get_enum(*_arg0); end
    def g_value_get_flags(*_arg0); end
    def g_value_get_int(*_arg0); end
    def g_value_get_object(*_arg0); end
    def g_value_get_string(*_arg0); end
    def g_value_get_uint64(*_arg0); end
    def g_value_init(*_arg0); end
    def g_value_set_boolean(*_arg0); end
    def g_value_set_double(*_arg0); end
    def g_value_set_enum(*_arg0); end
    def g_value_set_flags(*_arg0); end
    def g_value_set_int(*_arg0); end
    def g_value_set_object(*_arg0); end
    def g_value_set_string(*_arg0); end
    def g_value_set_uint64(*_arg0); end
    def g_value_unset(*_arg0); end
  end
end

GObject::GBOOL_TYPE = T.let(T.unsafe(nil), Integer)
GObject::GDOUBLE_TYPE = T.let(T.unsafe(nil), Integer)
GObject::GENUM_TYPE = T.let(T.unsafe(nil), Integer)
GObject::GFLAGS_TYPE = T.let(T.unsafe(nil), Integer)
GObject::GINT_TYPE = T.let(T.unsafe(nil), Integer)
GObject::GOBJECT_TYPE = T.let(T.unsafe(nil), Integer)

class GObject::GObject
  extend ::Forwardable
  extend ::SingleForwardable

  def initialize(ptr); end

  def [](*args, **_arg1, &block); end
  def ffi_managed_struct; end
  def ffi_struct; end
  def ptr; end
  def references; end
  def to_ptr(*args, **_arg1, &block); end

  class << self
    def ffi_managed_struct; end
    def ffi_struct; end
    def ptr(*args, **_arg1, &block); end
  end
end

module GObject::GObject::GObjectLayout
  class << self
    def included(base); end
  end
end

class GObject::GObject::ManagedStruct < ::FFI::ManagedStruct
  include ::GObject::GObject::GObjectLayout

  class << self
    def release(ptr); end
  end
end

class GObject::GObject::Struct < ::FFI::Struct
  include ::GObject::GObject::GObjectLayout
end

class GObject::GParamSpec < ::FFI::Struct; end
class GObject::GParamSpecPtr < ::FFI::Struct; end
GObject::GSTR_TYPE = T.let(T.unsafe(nil), Integer)
GObject::GUINT64_TYPE = T.let(T.unsafe(nil), Integer)

class GObject::GValue < ::FFI::ManagedStruct
  def get; end
  def init(gtype); end
  def set(value); end
  def unset; end

  class << self
    def alloc; end
    def from_nick(gtype, value); end
    def release(ptr); end
    def to_nick(gtype, enum_value); end
  end
end

module Vips
  extend ::FFI::Library
end
