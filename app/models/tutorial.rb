class Tutorial < ActiveRecord::Base
  include Publicable
  include Politeness
  include PathScoping
  include SelectorChecking

  belongs_to :site, inverse_of: :tutorials

  has_many :tips, as: :tippable, inverse_of: :tippable, dependent: :destroy

  validates :title, :site_id, presence: true
  validates :site,    associated: true

  sanitizes :welcome_message
end
