# Used to save a user's position in a text_section
class Bookmark < ActiveRecord::Base

  # Authority
  include Authority::Abilities

  # Constants

  # Associations
  belongs_to :user
  belongs_to :text_section
  delegate :text, to: :text_section

  # Scopes
  scope :automatic, -> { where(automatic: true) }

  # Validation
  validates :user, :text_section, presence: true
  validates :automatic, uniqueness: { scope: :automatic } # needs to be expanded to include text

end
