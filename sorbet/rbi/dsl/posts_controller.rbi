# typed: true

# DO NOT EDIT MANUALLY
# This is an autogenerated file for dynamic methods in `PostsController`.
# Please instead update this file by running `bin/tapioca dsl PostsController`.

class PostsController
  sig { returns(HelperProxy) }
  def helpers; end

  module HelperMethods
    include ::ActionText::ContentHelper
    include ::ActionText::TagHelper
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
