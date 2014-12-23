class Tutorial < ActiveRecord::Base

  include Publicable
  include Politeness
  include PathScoping
  include SelectorChecking
  include Validations

  belongs_to :site, inverse_of: :tutorials

  has_many :tips, as: :tippable, inverse_of: :tippable, dependent: :destroy

  before_validation :normalize_path

  validates :title, :site_id, presence: true
  validates :site,    associated: true

  sanitizes :welcome_message

  protected

    def normalize_path
      self.path = self.path.gsub(/(\s+)/, '')
    end

end
