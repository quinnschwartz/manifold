# Provides a serialization of a bookmark model.
class BookmarkSerializer < ActiveModel::Serializer
  meta(partial: false)

  attributes :id, :node_uuid, :automatic
  belongs_to :user
  belongs_to :text_section
end
