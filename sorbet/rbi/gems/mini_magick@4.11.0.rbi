# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for types exported from the `mini_magick` gem.
# Please instead update this file by running `bin/tapioca gem mini_magick`.

module MiniMagick
  extend ::MiniMagick::Configuration

  class << self
    def cli_version; end
    def graphicsmagick?; end
    def imagemagick7?; end
    def imagemagick?; end
    def version; end
    def with_cli(cli); end
  end
end

module MiniMagick::Configuration
  def cli; end
  def cli=(value); end
  def cli_path; end
  def cli_path=(_arg0); end
  def cli_prefix; end
  def cli_prefix=(_arg0); end
  def configure; end
  def debug; end
  def debug=(value); end
  def logger; end
  def logger=(_arg0); end
  def processor; end
  def processor=(processor); end
  def processor_path; end
  def processor_path=(_arg0); end
  def reload_tools; end
  def shell_api; end
  def shell_api=(_arg0); end
  def timeout; end
  def timeout=(_arg0); end
  def validate_on_create; end
  def validate_on_create=(_arg0); end
  def validate_on_write; end
  def validate_on_write=(_arg0); end
  def whiny; end
  def whiny=(_arg0); end

  class << self
    def extended(base); end
  end
end

MiniMagick::Configuration::CLI_DETECTION = T.let(T.unsafe(nil), Hash)
class MiniMagick::Error < ::RuntimeError; end

class MiniMagick::Image
  def initialize(input_path, tempfile = T.unsafe(nil), &block); end

  def ==(other); end
  def [](value); end
  def collapse!(frame = T.unsafe(nil)); end
  def colorspace(*args); end
  def combine_options(&block); end
  def composite(other_image, output_extension = T.unsafe(nil), mask = T.unsafe(nil)); end
  def data(*args); end
  def destroy!; end
  def details(*args); end
  def dimensions(*args); end
  def eql?(other); end
  def exif(*args); end
  def format(format, page = T.unsafe(nil), read_opts = T.unsafe(nil)); end
  def frames; end
  def get_pixels; end
  def hash; end
  def height(*args); end
  def human_size(*args); end
  def identify; end
  def info(value); end
  def landscape?; end
  def layer?; end
  def layers; end
  def method_missing(name, *args); end
  def mime_type(*args); end
  def mogrify(page = T.unsafe(nil)); end
  def pages; end
  def path; end
  def portrait?; end
  def resolution(*args); end
  def run_command(tool_name, *args); end
  def signature(*args); end
  def size(*args); end
  def tempfile; end
  def to_blob; end
  def type(*args); end
  def valid?; end
  def validate!; end
  def width(*args); end
  def write(output_to); end

  private

  def respond_to_missing?(method_name, include_private = T.unsafe(nil)); end

  class << self
    def attribute(name, key = T.unsafe(nil)); end
    def create(ext = T.unsafe(nil), validate = T.unsafe(nil), &block); end
    def get_image_from_pixels(pixels, dimension, map, depth, mime_type); end
    def import_pixels(blob, columns, rows, depth, map, format = T.unsafe(nil)); end
    def open(path_or_url, ext = T.unsafe(nil), options = T.unsafe(nil)); end
    def read(stream, ext = T.unsafe(nil)); end
  end
end

class MiniMagick::Image::Info
  def initialize(path); end

  def [](value, *args); end
  def cheap_info(value); end
  def clear; end
  def colorspace; end
  def data; end
  def details; end
  def exif; end
  def identify; end
  def mime_type; end
  def parse_warnings(raw_info); end
  def raw(value); end
  def raw_exif(value); end
  def resolution(unit = T.unsafe(nil)); end
  def signature; end

  private

  def decode_comma_separated_ascii_characters(encoded_value); end
  def path; end
end

MiniMagick::Image::Info::ASCII_ENCODED_EXIF_KEYS = T.let(T.unsafe(nil), Array)
class MiniMagick::Invalid < ::StandardError; end

class MiniMagick::Shell
  def execute(command, options = T.unsafe(nil)); end
  def run(command, options = T.unsafe(nil)); end

  private

  def execute_open3(command, options = T.unsafe(nil)); end
  def execute_posix_spawn(command, options = T.unsafe(nil)); end
  def log(command, &block); end
end

class MiniMagick::Tool
  def initialize(name, options = T.unsafe(nil)); end

  def +(*values); end
  def <<(arg); end
  def args; end
  def call(*args); end
  def canvas(value = T.unsafe(nil)); end
  def clone(*args); end
  def command; end
  def executable; end
  def gradient(value = T.unsafe(nil)); end
  def logo(value = T.unsafe(nil)); end
  def merge!(new_args); end
  def method_missing(name, *args); end
  def name; end
  def pango(value = T.unsafe(nil)); end
  def pattern(value = T.unsafe(nil)); end
  def plasma(value = T.unsafe(nil)); end
  def radial_gradient(value = T.unsafe(nil)); end
  def rose(value = T.unsafe(nil)); end
  def stack(*args); end
  def stdin; end
  def stdout; end
  def text(value = T.unsafe(nil)); end
  def xc(value = T.unsafe(nil)); end

  class << self
    def new(*args); end
    def option_methods; end
  end
end

class MiniMagick::Tool::Animate < ::MiniMagick::Tool
  def initialize(*args); end
end

MiniMagick::Tool::CREATION_OPERATORS = T.let(T.unsafe(nil), Array)

class MiniMagick::Tool::Compare < ::MiniMagick::Tool
  def initialize(*args); end
end

class MiniMagick::Tool::Composite < ::MiniMagick::Tool
  def initialize(*args); end
end

class MiniMagick::Tool::Conjure < ::MiniMagick::Tool
  def initialize(*args); end
end

class MiniMagick::Tool::Convert < ::MiniMagick::Tool
  def initialize(*args); end
end

class MiniMagick::Tool::Display < ::MiniMagick::Tool
  def initialize(*args); end
end

class MiniMagick::Tool::Identify < ::MiniMagick::Tool
  def initialize(*args); end
end

class MiniMagick::Tool::Import < ::MiniMagick::Tool
  def initialize(*args); end
end

class MiniMagick::Tool::Magick < ::MiniMagick::Tool
  def initialize(*args); end
end

class MiniMagick::Tool::Mogrify < ::MiniMagick::Tool
  def initialize(*args); end
end

class MiniMagick::Tool::MogrifyRestricted < ::MiniMagick::Tool::Mogrify
  def format(*args); end
end

class MiniMagick::Tool::Montage < ::MiniMagick::Tool
  def initialize(*args); end
end

class MiniMagick::Tool::Stream < ::MiniMagick::Tool
  def initialize(*args); end
end

module MiniMagick::Utilities
  private

  def tempfile(extension); end
  def which(cmd); end

  class << self
    def tempfile(extension); end
    def which(cmd); end
  end
end

module MiniMagick::VERSION; end
MiniMagick::VERSION::MAJOR = T.let(T.unsafe(nil), Integer)
MiniMagick::VERSION::MINOR = T.let(T.unsafe(nil), Integer)
MiniMagick::VERSION::STRING = T.let(T.unsafe(nil), String)
MiniMagick::VERSION::TINY = T.let(T.unsafe(nil), Integer)
