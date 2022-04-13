# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for dynamic methods in `HomeController`.
# Please instead update this file by running `bin/tapioca dsl HomeController`.

class HomeController
  sig { returns(HelperProxy) }
  def helpers; end

  module HelperMethods
    include ::Turbo::DriveHelper
    include ::Turbo::FramesHelper
    include ::Turbo::IncludesHelper
    include ::Turbo::StreamsHelper
    include ::Turbo::Streams::ActionHelper
    include ::ActionController::Base::HelperMethods
    include ::ApplicationHelper
    include ::PreviewHelper

    sig { returns(T.untyped) }
    def current_user; end
  end

  class HelperProxy < ::ActionView::Base
    include HelperMethods
  end
end
