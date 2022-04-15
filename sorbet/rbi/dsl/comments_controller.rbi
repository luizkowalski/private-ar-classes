# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for dynamic methods in `CommentsController`.
# Please instead update this file by running `bin/tapioca dsl CommentsController`.

class CommentsController
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

    sig { returns(T.untyped) }
    def user_logged_in?; end
  end

  class HelperProxy < ::ActionView::Base
    include HelperMethods
  end
end
