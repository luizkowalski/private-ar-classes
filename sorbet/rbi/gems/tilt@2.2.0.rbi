# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for types exported from the `tilt` gem.
# Please instead update this file by running `bin/tapioca gem tilt`.

# Namespace for Tilt. This module is not intended to be included anywhere.
#
# source://tilt//lib/tilt/template.rb#2
module Tilt
  class << self
    # @see Tilt::Mapping#[]
    #
    # source://tilt//lib/tilt.rb#69
    def [](file); end

    # @example
    #   tmpl = Tilt['index.erb'].new { '<%= Tilt.current_template %>' }
    #   tmpl.render == tmpl.to_s
    # @note This is currently an experimental feature and might return nil
    #   in the future.
    # @return the template object that is currently rendering.
    #
    # source://tilt//lib/tilt.rb#91
    def current_template; end

    # @return [Tilt::Mapping] the main mapping object
    #
    # source://tilt//lib/tilt.rb#98
    def default_mapping; end

    # Replace the default mapping with a finalized version of the default
    # mapping. This can be done to improve performance after the template
    # libraries you desire to use have already been loaded.  Once this is
    # is called, all attempts to modify the default mapping will fail.
    # This also freezes Tilt itself.
    #
    # source://tilt//lib/tilt.rb#20
    def finalize!; end

    # @private
    #
    # source://tilt//lib/tilt.rb#39
    def lazy_map; end

    # @see Tilt::Mapping#new
    #
    # source://tilt//lib/tilt.rb#64
    def new(file, line = T.unsafe(nil), options = T.unsafe(nil), &block); end

    # Alias register as prefer for Tilt 1.x compatibility.
    #
    # @see Tilt::Mapping#register
    #
    # source://tilt//lib/tilt.rb#44
    def prefer(template_class, *extensions); end

    # @see Tilt::Mapping#register
    #
    # source://tilt//lib/tilt.rb#44
    def register(template_class, *extensions); end

    # @see Tilt::Mapping#register_lazy
    #
    # source://tilt//lib/tilt.rb#49
    def register_lazy(class_name, file, *extensions); end

    # @see Tilt::Mapping#register_pipeline
    #
    # source://tilt//lib/tilt.rb#54
    def register_pipeline(ext, options = T.unsafe(nil)); end

    # @return [Boolean]
    # @see Tilt::Mapping#registered?
    #
    # source://tilt//lib/tilt.rb#59
    def registered?(ext); end

    # @see Tilt::Mapping#template_for
    #
    # source://tilt//lib/tilt.rb#74
    def template_for(file); end

    # @see Tilt::Mapping#templates_for
    #
    # source://tilt//lib/tilt.rb#79
    def templates_for(file); end
  end
end

# Private internal base class for both Mapping and FinalizedMapping, for the shared methods.
#
# source://tilt//lib/tilt/mapping.rb#6
class Tilt::BaseMapping
  # Looks up a template class based on file name and/or extension.
  #
  # @example
  #   mapping['views/hello.erb'] # => Tilt::ERBTemplate
  #   mapping['hello.erb']       # => Tilt::ERBTemplate
  #   mapping['erb']             # => Tilt::ERBTemplate
  # @return [template class]
  #
  # source://tilt//lib/tilt/mapping.rb#32
  def [](file); end

  # Instantiates a new template class based on the file.
  #
  # @example
  #   mapping.new('index.mt') # => instance of MyEngine::Template
  # @raise [RuntimeError] if there is no template class registered for the
  #   file name.
  # @see Tilt::Template.new
  #
  # source://tilt//lib/tilt/mapping.rb#16
  def new(file, line = T.unsafe(nil), options = T.unsafe(nil), &block); end

  # Looks up a template class based on file name and/or extension.
  #
  # @example
  #   mapping['views/hello.erb'] # => Tilt::ERBTemplate
  #   mapping['hello.erb']       # => Tilt::ERBTemplate
  #   mapping['erb']             # => Tilt::ERBTemplate
  # @return [template class]
  #
  # source://tilt//lib/tilt/mapping.rb#32
  def template_for(file); end

  # Looks up a list of template classes based on file name. If the file name
  # has multiple extensions, it will return all template classes matching the
  # extensions from the end.
  #
  # @example
  #   mapping.templates_for('views/index.haml.erb')
  #   # => [Tilt::ERBTemplate, Tilt::HamlTemplate]
  # @return [Array<template class>]
  #
  # source://tilt//lib/tilt/mapping.rb#48
  def templates_for(file); end

  private

  # source://tilt//lib/tilt/mapping.rb#63
  def split(file); end
end

# Builder template implementation.
#
# source://tilt//lib/tilt/builder.rb#7
class Tilt::BuilderTemplate < ::Tilt::Template
  # source://tilt//lib/tilt/builder.rb#14
  def evaluate(scope, locals, &block); end

  # source://tilt//lib/tilt/builder.rb#28
  def precompiled_postamble(locals); end

  # source://tilt//lib/tilt/builder.rb#32
  def precompiled_template(locals); end

  # source://tilt//lib/tilt/builder.rb#10
  def prepare; end

  private

  # source://tilt//lib/tilt/builder.rb#38
  def xml_builder; end
end

# CSV Template implementation. See:
# http://ruby-doc.org/stdlib/libdoc/csv/rdoc/CSV.html
#
# == Example
#
#    # Example of csv template
#    tpl = <<-EOS
#      # header
#      csv << ['NAME', 'ID']
#
#      # data rows
#      @people.each do |person|
#        csv << [person[:name], person[:id]]
#      end
#    EOS
#
#    @people = [
#      {:name => "Joshua Peek", :id => 1},
#      {:name => "Ryan Tomayko", :id => 2},
#      {:name => "Simone Carletti", :id => 3}
#    ]
#
#    template = Tilt::CSVTemplate.new { tpl }
#    template.render(self)
#
# source://tilt//lib/tilt/csv.rb#32
class Tilt::CSVTemplate < ::Tilt::Template
  # source://tilt//lib/tilt/csv.rb#47
  def precompiled(locals); end

  # source://tilt//lib/tilt/csv.rb#39
  def precompiled_template(locals); end

  # source://tilt//lib/tilt/csv.rb#35
  def prepare; end
end

# Extremely simple template cache implementation. Calling applications
# create a Tilt::Cache instance and use #fetch with any set of hashable
# arguments (such as those to Tilt.new):
#
#     cache = Tilt::Cache.new
#     cache.fetch(path, line, options) { Tilt.new(path, line, options) }
#
# Subsequent invocations return the already loaded template object.
#
# @note Tilt::Cache is a thin wrapper around Hash.  It has the following
#   limitations:
#   * Not thread-safe.
#   * Size is unbounded.
#   * Keys are not copied defensively, and should not be modified after
#   being passed to #fetch.  More specifically, the values returned by
#   key#hash and key#eql? should not change.
#   If this is too limiting for you, use a different cache implementation.
#
# source://tilt//lib/tilt.rb#122
class Tilt::Cache
  # @return [Cache] a new instance of Cache
  #
  # source://tilt//lib/tilt.rb#123
  def initialize; end

  # Clears the cache.
  #
  # source://tilt//lib/tilt.rb#140
  def clear; end

  # Caches a value for key, or returns the previously cached value.
  # If a value has been previously cached for key then it is
  # returned. Otherwise, block is yielded to and its return value
  # which may be nil, is cached under key and returned.
  #
  # @yield
  # @yieldreturn the value to cache for key
  #
  # source://tilt//lib/tilt.rb#133
  def fetch(*key); end
end

# @private
#
# source://tilt//lib/tilt/template.rb#4
module Tilt::CompiledTemplates; end

# source://tilt//lib/tilt.rb#10
Tilt::EMPTY_HASH = T.let(T.unsafe(nil), Hash)

# ERB template implementation. See:
# http://www.ruby-doc.org/stdlib/libdoc/erb/rdoc/classes/ERB.html
#
# source://tilt//lib/tilt/erb.rb#8
class Tilt::ERBTemplate < ::Tilt::Template
  # @return [Boolean]
  #
  # source://tilt//lib/tilt/erb.rb#74
  def freeze_string_literals?; end

  # ERB generates a line to specify the character coding of the generated
  # source in 1.9. Account for this in the line offset.
  #
  # source://tilt//lib/tilt/erb.rb#69
  def precompiled(locals); end

  # source://tilt//lib/tilt/erb.rb#58
  def precompiled_postamble(locals); end

  # source://tilt//lib/tilt/erb.rb#50
  def precompiled_preamble(locals); end

  # source://tilt//lib/tilt/erb.rb#45
  def precompiled_template(locals); end

  # source://tilt//lib/tilt/erb.rb#25
  def prepare; end

  class << self
    # source://tilt//lib/tilt/erb.rb#13
    def _default_output_variable; end

    # source://tilt//lib/tilt/erb.rb#16
    def default_output_variable; end

    # source://tilt//lib/tilt/erb.rb#20
    def default_output_variable=(name); end
  end
end

# source://tilt//lib/tilt/erb.rb#9
Tilt::ERBTemplate::SUPPORTS_KVARGS = T.let(T.unsafe(nil), Array)

# Erubi (a simplified version of Erubis) template implementation.
# See https://github.com/jeremyevans/erubi
#
# ErubiTemplate supports the following additional options, in addition
# to the options supported by the Erubi engine:
#
# :engine_class :: allows you to specify a custom engine class to use
#                  instead of the default (which is ::Erubi::Engine).
#
# source://tilt//lib/tilt/erubi.rb#14
class Tilt::ErubiTemplate < ::Tilt::Template
  # @return [Boolean]
  #
  # source://tilt//lib/tilt/erubi.rb#51
  def freeze_string_literals?; end

  # source://tilt//lib/tilt/erubi.rb#47
  def precompiled_template(locals); end

  # source://tilt//lib/tilt/erubi.rb#15
  def prepare; end
end

# source://tilt//lib/tilt/etanni.rb#5
class Tilt::EtanniTemplate < ::Tilt::Template
  # source://tilt//lib/tilt/etanni.rb#23
  def precompiled(locals); end

  # source://tilt//lib/tilt/etanni.rb#19
  def precompiled_template(locals); end

  # source://tilt//lib/tilt/etanni.rb#6
  def prepare; end
end

# Private internal class for finalized mappings, which are frozen and
# cannot be modified.
#
# source://tilt//lib/tilt/mapping.rb#370
class Tilt::FinalizedMapping < ::Tilt::BaseMapping
  # Set the template map to use.  The template map should already
  # be frozen, but this is an internal class, so it does not
  # explicitly check for that.
  #
  # @return [FinalizedMapping] a new instance of FinalizedMapping
  #
  # source://tilt//lib/tilt/mapping.rb#374
  def initialize(template_map); end

  # Returns receiver, since instances are always frozen.
  #
  # source://tilt//lib/tilt/mapping.rb#385
  def clone(freeze: T.unsafe(nil)); end

  # Returns receiver, since instances are always frozen.
  #
  # source://tilt//lib/tilt/mapping.rb#380
  def dup; end

  # Returns an aarry of all extensions the template class will
  # be used for.
  #
  # source://tilt//lib/tilt/mapping.rb#396
  def extensions_for(template_class); end

  # Return whether the given file extension has been registered.
  #
  # @return [Boolean]
  #
  # source://tilt//lib/tilt/mapping.rb#390
  def registered?(ext); end

  private

  # source://tilt//lib/tilt/mapping.rb#407
  def lookup(ext); end
end

# @private
#
# source://tilt//lib/tilt/template.rb#11
Tilt::LOCK = T.let(T.unsafe(nil), Thread::Mutex)

# Tilt::Mapping associates file extensions with template implementations.
#
#     mapping = Tilt::Mapping.new
#     mapping.register(Tilt::RDocTemplate, 'rdoc')
#     mapping['index.rdoc'] # => Tilt::RDocTemplate
#     mapping.new('index.rdoc').render
#
# You can use {#register} to register a template class by file
# extension, {#registered?} to see if a file extension is mapped,
# {#[]} to lookup template classes, and {#new} to instantiate template
# objects.
#
# Mapping also supports *lazy* template implementations. Note that regularly
# registered template implementations *always* have preference over lazily
# registered template implementations. You should use {#register} if you
# depend on a specific template implementation and {#register_lazy} if there
# are multiple alternatives.
#
#     mapping = Tilt::Mapping.new
#     mapping.register_lazy('RDiscount::Template', 'rdiscount/template', 'md')
#     mapping['index.md']
#     # => RDiscount::Template
#
# {#register_lazy} takes a class name, a filename, and a list of file
# extensions. When you try to lookup a template name that matches the
# file extension, Tilt will automatically try to require the filename and
# constantize the class name.
#
# Unlike {#register}, there can be multiple template implementations
# registered lazily to the same file extension. Tilt will attempt to load the
# template implementations in order (registered *last* would be tried first),
# returning the first which doesn't raise LoadError.
#
# If all of the registered template implementations fails, Tilt will raise
# the exception of the first, since that was the most preferred one.
#
#     mapping = Tilt::Mapping.new
#     mapping.register_lazy('Maruku::Template', 'maruku/template', 'md')
#     mapping.register_lazy('RDiscount::Template', 'rdiscount/template', 'md')
#     mapping['index.md']
#     # => RDiscount::Template
#
# In the previous example we say that RDiscount has a *higher priority* than
# Maruku. Tilt will first try to `require "rdiscount/template"`, falling
# back to `require "maruku/template"`. If none of these are successful,
# the first error will be raised.
#
# source://tilt//lib/tilt/mapping.rb#125
class Tilt::Mapping < ::Tilt::BaseMapping
  # @return [Mapping] a new instance of Mapping
  #
  # source://tilt//lib/tilt/mapping.rb#131
  def initialize; end

  # Finds the extensions the template class has been registered under.
  #
  # @param template_class [template class]
  #
  # source://tilt//lib/tilt/mapping.rb#287
  def extensions_for(template_class); end

  # Return a finalized mapping. A finalized mapping will only include
  # support for template libraries already loaded, and will not
  # allow registering new template libraries or lazy loading template
  # libraries not yet loaded. Finalized mappings improve performance
  # by not requiring synchronization and ensure that the mapping will
  # not attempt to load additional files (useful when restricting
  # file system access after template libraries in use are loaded).
  #
  # source://tilt//lib/tilt/mapping.rb#151
  def finalized; end

  # @private
  #
  # source://tilt//lib/tilt/mapping.rb#129
  def lazy_map; end

  # Registers a template implementation by file extension. There can only be
  # one template implementation per file extension, and this method will
  # override any existing mapping.
  #
  # @example
  #   mapping.register MyEngine::Template, 'mt'
  #   mapping['index.mt'] # => MyEngine::Template
  # @param template_class
  # @param extensions [Array<String>] List of extensions.
  # @return [void]
  #
  # source://tilt//lib/tilt/mapping.rb#200
  def register(template_class, *extensions); end

  # Registers a lazy template implementation by file extension. You
  # can have multiple lazy template implementations defined on the
  # same file extension, in which case the template implementation
  # defined *last* will be attempted loaded *first*.
  #
  # @example
  #   mapping.register_lazy 'MyEngine::Template', 'my_engine/template',  'mt'
  #
  #   defined?(MyEngine::Template) # => false
  #   mapping['index.mt'] # => MyEngine::Template
  #   defined?(MyEngine::Template) # => true
  # @param class_name [String] Class name of a template class.
  # @param file [String] Filename where the template class is defined.
  # @param extensions [Array<String>] List of extensions.
  # @return [void]
  #
  # source://tilt//lib/tilt/mapping.rb#176
  def register_lazy(class_name, file, *extensions); end

  # Register a new template class using the given extension that
  # represents a pipeline of multiple existing template, where the
  # output from the previous template is used as input to the next
  # template.
  #
  # This will register a template class that processes the input
  # with the *erb* template processor, and takes the output of
  # that and feeds it to the *scss* template processor, returning
  # the output of the *scss* template processor as the result of
  # the pipeline.
  #
  # @example
  #   mapping.register_pipeline('scss.erb')
  #   mapping.register_pipeline('scss.erb', 'erb'=>{:outvar=>'@foo'})
  #   mapping.register_pipeline('scsserb', :extra_exts => 'scss.erb',
  #   :templates=>['erb', 'scss'])
  # @option :templates
  # @option :extra_exts
  # @option String
  # @param ext [String] Primary extension to register
  # @param :templates [Hash] a customizable set of options
  # @param :extra_exts [Hash] a customizable set of options
  # @param String [Hash] a customizable set of options
  # @return [void]
  #
  # source://tilt//lib/tilt/mapping.rb#238
  def register_pipeline(ext, options = T.unsafe(nil)); end

  # Checks if a file extension is registered (either eagerly or
  # lazily) in this mapping.
  #
  # @example
  #   mapping.registered?('erb')  # => true
  #   mapping.registered?('nope') # => false
  # @param ext [String] File extension.
  # @return [Boolean]
  #
  # source://tilt//lib/tilt/mapping.rb#280
  def registered?(ext); end

  # @private
  #
  # source://tilt//lib/tilt/mapping.rb#129
  def template_map; end

  # Unregisters an extension. This removes the both normal registrations
  # and lazy registrations.
  #
  # @example
  #   mapping.register MyEngine::Template, 'mt'
  #   mapping['index.mt'] # => MyEngine::Template
  #   mapping.unregister('mt')
  #   mapping['index.mt'] # => nil
  # @param extensions [Array<String>] List of extensions.
  # @return nil
  #
  # source://tilt//lib/tilt/mapping.rb#260
  def unregister(*extensions); end

  private

  # The proper behavior (in MRI) for autoload? is to
  # return `false` when the constant/file has been
  # explicitly required.
  #
  # However, in JRuby it returns `true` even after it's
  # been required. In that case it turns out that `defined?`
  # returns `"constant"` if it exists and `nil` when it doesn't.
  # This is actually a second bug: `defined?` should resolve
  # autoload (aka. actually try to require the file).
  #
  # We use the second bug in order to resolve the first bug.
  #
  # @return [Boolean]
  #
  # source://tilt//lib/tilt/mapping.rb#360
  def constant_defined?(name); end

  # @private
  #
  # source://tilt//lib/tilt/mapping.rb#137
  def initialize_copy(other); end

  # @return [Boolean]
  #
  # source://tilt//lib/tilt/mapping.rb#301
  def lazy?(ext); end

  # source://tilt//lib/tilt/mapping.rb#320
  def lazy_load(pattern); end

  # source://tilt//lib/tilt/mapping.rb#306
  def lookup(ext); end

  # source://tilt//lib/tilt/mapping.rb#310
  def register_defined_classes(class_names, pattern); end
end

# source://tilt//lib/tilt/mapping.rb#126
Tilt::Mapping::LOCK = T.let(T.unsafe(nil), Thread::Mutex)

# Nokogiri template implementation. See:
# http://nokogiri.org/
#
# source://tilt//lib/tilt/nokogiri.rb#8
class Tilt::NokogiriTemplate < ::Tilt::Template
  # source://tilt//lib/tilt/nokogiri.rb#12
  def evaluate(scope, locals); end

  # source://tilt//lib/tilt/nokogiri.rb#29
  def precompiled_postamble(locals); end

  # source://tilt//lib/tilt/nokogiri.rb#24
  def precompiled_preamble(locals); end

  # source://tilt//lib/tilt/nokogiri.rb#33
  def precompiled_template(locals); end
end

# source://tilt//lib/tilt/nokogiri.rb#9
Tilt::NokogiriTemplate::DOCUMENT_HEADER = T.let(T.unsafe(nil), Regexp)

# Superclass used for pipeline templates.  Should not be used directly.
#
# source://tilt//lib/tilt/pipeline.rb#6
class Tilt::Pipeline < ::Tilt::Template
  # source://tilt//lib/tilt/pipeline.rb#15
  def evaluate(scope, locals, &block); end

  # source://tilt//lib/tilt/pipeline.rb#7
  def prepare; end
end

# Raw text (no template functionality).
#
# source://tilt//lib/tilt/plain.rb#0
class Tilt::PlainTemplate < ::Tilt::StaticTemplate
  private

  # source://tilt//lib/tilt/plain.rb#5
  def _prepare_output; end
end

# RDoc template. See: https://github.com/ruby/rdoc
#
# It's suggested that your program run the following at load time when
# using this templae engine in a threaded environment:
#
#   require 'rdoc'
#   require 'rdoc/markup'
#   require 'rdoc/markup/to_html'
#   require 'rdoc/options'
#
# source://tilt//lib/tilt/rdoc.rb#0
class Tilt::RDocTemplate < ::Tilt::StaticTemplate
  private

  # source://tilt//lib/tilt/rdoc.rb#17
  def _prepare_output; end
end

# Sass template implementation for generating CSS. See: https://sass-lang.com/
#
# Sass templates do not support object scopes, locals, or yield.
#
# source://tilt//lib/tilt/sass.rb#8
class Tilt::SassTemplate < ::Tilt::StaticTemplate
  private

  # source://tilt//lib/tilt/sass.rb#44
  def _prepare_output; end

  # source://tilt//lib/tilt/sass.rb#48
  def sass_options; end
end

# source://tilt//lib/tilt/sass.rb#32
Tilt::SassTemplate::Engine = SassC::Engine

# source://tilt//lib/tilt/sass.rb#58
class Tilt::ScssTemplate < ::Tilt::SassTemplate
  private

  # source://tilt//lib/tilt/sass.rb#63
  def sass_options; end
end

# source://tilt//lib/tilt/template.rb#416
class Tilt::StaticTemplate < ::Tilt::Template
  # Static templates never allow script.
  #
  # @return [Boolean]
  #
  # source://tilt//lib/tilt/template.rb#439
  def allows_script?; end

  # Raise NotImplementedError, since static templates
  # do not support compiled methods.
  #
  # @raise [NotImplementedError]
  #
  # source://tilt//lib/tilt/template.rb#434
  def compiled_method(locals_keys, scope_class = T.unsafe(nil)); end

  # Static templates always return the prepared output.
  #
  # source://tilt//lib/tilt/template.rb#428
  def render(scope = T.unsafe(nil), locals = T.unsafe(nil)); end

  protected

  # source://tilt//lib/tilt/template.rb#445
  def prepare; end

  private

  # Do nothing, since compiled method cache is not used.
  #
  # source://tilt//lib/tilt/template.rb#452
  def set_compiled_method_cache; end

  class << self
    # source://tilt//lib/tilt/template.rb#417
    def subclass(mime_type: T.unsafe(nil), &block); end
  end
end

# The template source is evaluated as a Ruby string. The #{} interpolation
# syntax can be used to generated dynamic output.
#
# source://tilt//lib/tilt/string.rb#7
class Tilt::StringTemplate < ::Tilt::Template
  # source://tilt//lib/tilt/string.rb#17
  def precompiled(locals); end

  # source://tilt//lib/tilt/string.rb#13
  def precompiled_template(locals); end

  # source://tilt//lib/tilt/string.rb#8
  def prepare; end
end

# @private
#
# source://tilt//lib/tilt/template.rb#8
Tilt::TOPOBJECT = Tilt::CompiledTemplates

# Base class for template implementations. Subclasses must implement
# the #prepare method and one of the #evaluate or #precompiled_template
# methods.
#
# source://tilt//lib/tilt/template.rb#16
class Tilt::Template
  # Create a new template with the file, line, and options specified. By
  # default, template data is read from the file. When a block is given,
  # it should read template data and return as a String. When file is nil,
  # a block is required.
  #
  # All arguments are optional.
  #
  # @raise [ArgumentError]
  # @return [Template] a new instance of Template
  #
  # source://tilt//lib/tilt/template.rb#61
  def initialize(file = T.unsafe(nil), line = T.unsafe(nil), options = T.unsafe(nil)); end

  # The basename of the template file.
  #
  # source://tilt//lib/tilt/template.rb#110
  def basename(suffix = T.unsafe(nil)); end

  # The compiled method for the locals keys and scope_class provided.
  # Returns an UnboundMethod, which can be used to define methods
  # directly on the scope class, which are much faster to call than
  # Tilt's normal rendering.
  #
  # source://tilt//lib/tilt/template.rb#151
  def compiled_method(locals_keys, scope_class = T.unsafe(nil)); end

  # A path ending in .rb that the template code will be written to, then
  # required, instead of being evaled.  This is useful for determining
  # coverage of compiled template code, or to use static analysis tools
  # on the compiled template code.
  #
  # source://tilt//lib/tilt/template.rb#35
  def compiled_path; end

  # Set the prefix to use for compiled paths.
  #
  # source://tilt//lib/tilt/template.rb#137
  def compiled_path=(path); end

  # Template source; loaded from a file or given directly.
  #
  # source://tilt//lib/tilt/template.rb#18
  def data; end

  # The filename used in backtraces to describe the template.
  #
  # source://tilt//lib/tilt/template.rb#122
  def eval_file; end

  # The name of the file where the template data was loaded from.
  #
  # source://tilt//lib/tilt/template.rb#21
  def file; end

  # The line number in #file where template data was loaded from.
  #
  # source://tilt//lib/tilt/template.rb#24
  def line; end

  # An empty Hash that the template engine can populate with various
  # metadata.
  #
  # source://tilt//lib/tilt/template.rb#128
  def metadata; end

  # The template file's basename with all extensions chomped off.
  #
  # source://tilt//lib/tilt/template.rb#115
  def name; end

  # A Hash of template engine specific options. This is passed directly
  # to the underlying engine and is not used by the generic template
  # interface.
  #
  # source://tilt//lib/tilt/template.rb#29
  def options; end

  # Render the template in the given scope with the locals specified. If a
  # block is given, it is typically available within the template via
  # +yield+.
  #
  # source://tilt//lib/tilt/template.rb#101
  def render(scope = T.unsafe(nil), locals = T.unsafe(nil), &block); end

  protected

  # The encoding of the source data. Defaults to the
  # default_encoding-option if present. You may override this method
  # in your template class if you have a better hint of the data's
  # encoding.
  #
  # source://tilt//lib/tilt/template.rb#173
  def default_encoding; end

  # Execute the compiled template and return the result string. Template
  # evaluation is guaranteed to be performed in the scope object with the
  # locals specified and with support for yielding to the block.
  #
  # This method is only used by source generating templates. Subclasses that
  # override render() may not support all features.
  #
  # source://tilt//lib/tilt/template.rb#196
  def evaluate(scope, locals, &block); end

  # Generates all template source by combining the preamble, template, and
  # postamble and returns a two-tuple of the form: [source, offset], where
  # source is the string containing (Ruby) source code for the template and
  # offset is the integer line offset where line reporting should begin.
  #
  # Template subclasses may override this method when they need complete
  # control over source generation or want to adjust the default line
  # offset. In most cases, overriding the #precompiled_template method is
  # easier and more appropriate.
  #
  # source://tilt//lib/tilt/template.rb#228
  def precompiled(local_keys); end

  # source://tilt//lib/tilt/template.rb#266
  def precompiled_postamble(local_keys); end

  # source://tilt//lib/tilt/template.rb#262
  def precompiled_preamble(local_keys); end

  # A string containing the (Ruby) source code for the template. The
  # default Template#evaluate implementation requires either this
  # method or the #precompiled method be overridden. When defined,
  # the base Template guarantees correct file/line handling, locals
  # support, custom scopes, proper encoding, and support for template
  # compilation.
  #
  # @raise [NotImplementedError]
  #
  # source://tilt//lib/tilt/template.rb#258
  def precompiled_template(local_keys); end

  # Do whatever preparation is necessary to setup the underlying template
  # engine. Called immediately after template data is loaded. Instance
  # variables set in this method are available when #evaluate is called.
  #
  # Empty by default as some subclasses do not need separate preparation.
  #
  # source://tilt//lib/tilt/template.rb#184
  def prepare; end

  # @return [Boolean]
  #
  # source://tilt//lib/tilt/template.rb#175
  def skip_compiled_encoding_detection?; end

  private

  # source://tilt//lib/tilt/template.rb#407
  def binary(string); end

  # source://tilt//lib/tilt/template.rb#345
  def bind_compiled_method(method_source, offset, scope_class); end

  # source://tilt//lib/tilt/template.rb#322
  def compile_template_method(local_keys, scope_class = T.unsafe(nil)); end

  # source://tilt//lib/tilt/template.rb#370
  def eval_compiled_method(method_source, offset, scope_class); end

  # source://tilt//lib/tilt/template.rb#388
  def extract_encoding(script, &block); end

  # source://tilt//lib/tilt/template.rb#392
  def extract_magic_comment(script); end

  # @return [Boolean]
  #
  # source://tilt//lib/tilt/template.rb#403
  def freeze_string_literals?; end

  # source://tilt//lib/tilt/template.rb#374
  def load_compiled_method(path, method_source); end

  # source://tilt//lib/tilt/template.rb#301
  def local_extraction(local_keys); end

  # source://tilt//lib/tilt/template.rb#274
  def process_arg(arg); end

  # source://tilt//lib/tilt/template.rb#288
  def read_template_file; end

  # source://tilt//lib/tilt/template.rb#297
  def set_compiled_method_cache; end

  # source://tilt//lib/tilt/template.rb#382
  def unbind_compiled_method(method_name); end

  class << self
    # Use `.metadata[:mime_type]` instead.
    #
    # source://tilt//lib/tilt/template.rb#45
    def default_mime_type; end

    # Use `.metadata[:mime_type] = val` instead.
    #
    # source://tilt//lib/tilt/template.rb#50
    def default_mime_type=(value); end

    # An empty Hash that the template engine can populate with various
    # metadata.
    #
    # source://tilt//lib/tilt/template.rb#40
    def metadata; end
  end
end

# source://tilt//lib/tilt/template.rb#187
Tilt::Template::CLASS_METHOD = T.let(T.unsafe(nil), UnboundMethod)

# source://tilt//lib/tilt/template.rb#188
Tilt::Template::USE_BIND_CALL = T.let(T.unsafe(nil), TrueClass)

# Current version.
#
# source://tilt//lib/tilt.rb#8
Tilt::VERSION = T.let(T.unsafe(nil), String)
