class Tip < ActiveRecord::Base

  include Publicable
  include Politeness
  include PathScoping
  include RankedModel
  include PathValidations

  belongs_to :tippable, polymorphic: true, inverse_of: :tips
  belongs_to :tutorial, polymorphic: true

  validates :tippable_id, :tippable_type, presence: true
  validates :tippable, associated: true

  validates :title, :content, presence: true
  validate :validate_path

  sanitizes :content

  attr_accessor :redisplay

  before_save do |tip|
    tip.redisplay && tip.states.delete_all
  end

  before_validation :on => :create do |tip|
    tip.position = :last
  end

  ranks :row_order, :with_same => [:tippable_id, :tippable_type]

  scope :sort_by_row_order, -> { rank(:row_order) }
  scope :broadcasts_first,  -> { order(%[ CASE selector WHEN '' THEN 0 ELSE 1 END ]) }

  scope :sorted, -> { sort_by_row_order.broadcasts_first }

  def self.update_path path
    self.all.map do |t|
      if (t.path.blank? || t.path == '/') && t.site_host_ref.blank?
        t.update_attribute :path, path
      end
    end
  end

  def position=(pos)
    self.row_order_position = pos
  end

end
