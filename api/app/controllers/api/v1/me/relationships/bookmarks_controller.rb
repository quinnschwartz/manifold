module Api
  module V1
    module Me
      module Relationships
        # Bookmarks Controller
        class BookmarksController < ApplicationController

          INCLUDES = %w(bookmarks).freeze
          LOCATION = [:api, :v1, :me].freeze

          resourceful! Bookmark, authorize_options: { only: [] } do
            @current_user.bookmarks
          end

          def index
            @bookmarks = load_bookmarks
            render_multiple_resources(
              @bookmarks,
              each_serializer: BookmarkSerializer,
              location: LOCATION
            )
          end

          def create
            updater = ::Updaters::Default.new(bookmark_params)
            @bookmark = updater.update(@current_user.bookmarks.build)
            if @bookmark.valid?
              render_single_resource(@current_user, includes: INCLUDES, location: LOCATION)
            else
              render_single_resource(@bookmark, includes: INCLUDES, location: LOCATION)
            end
          end

        end
      end
    end
  end
end
