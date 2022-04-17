# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for dynamic methods in `ApplicationController`.
# Please instead update this file by running `bin/tapioca dsl ApplicationController`.

class ApplicationController
  include GeneratedUrlHelpersModule
  include GeneratedPathHelpersModule

  sig { returns(HelperProxy) }
  def helpers; end

  module HelperMethods
    include ::Turbo::DriveHelper
    include ::Turbo::FramesHelper
    include ::Turbo::IncludesHelper
    include ::Turbo::StreamsHelper
    include ::Turbo::Streams::ActionHelper
    include ::ActionText::ContentHelper
    include ::ActionText::TagHelper
    include ::ActionController::Base::HelperMethods
    include ::ApplicationHelper

    sig { returns(T.untyped) }
    def current_user; end

    sig { returns(T.untyped) }
    def user_logged_in?; end
  end

  class HelperProxy < ::ActionView::Base
    include HelperMethods
  end
end
