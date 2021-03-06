# A stylesheet
class Stylesheet < ApplicationRecord

  # Authority
  include Authority::Abilities

  # Associations
  belongs_to :text
  belongs_to :ingestion_source, optional: true

  def to_s
    "stylesheet #{id}"
  end

end
