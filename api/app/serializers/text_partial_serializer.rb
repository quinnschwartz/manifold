# Provides a partial serialization of a text model.
class TextPartialSerializer < ActiveModel::Serializer
  attributes :id, :title, :creator_names, :unique_identifier, :cover_url
end