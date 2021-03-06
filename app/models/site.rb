# The Site model represent a User's site, that has many tips and many
# tutorials.
#
class Site < ActiveRecord::Base
  belongs_to :user, inverse_of: :sites

  has_many :tips, as: :tippable, inverse_of: :tippable, dependent: :destroy
  has_many :tutorials,           inverse_of: :site,     dependent: :destroy

  before_validation :normalize_hostname

  validates :user_id, :name, :protocol, presence: true,  uniqueness: { scope: :hostname }
  validates :hostname, presence: true, uniqueness: true, format: { with: /[a-z0-9]*(\.?[a-z0-9]+)\.[a-z]{2,5}(:[0-9]{1,5})?(\/.)?/ }
  validates :protocol, inclusion: { in: %w(http https) }

  scope :by_user, ->(user) { where(user_id: user.id) }

  def self.create_tips(params)
    self.all.map { |s| s.tips.create params }
  end

  def url
    [self.protocol, '://', self.hostname].join()
  end

  protected

  # method used to remove http|s from the hostname (we have a separate protocol field now)
  # + it removes whitespaces + extra /
  def normalize_hostname
    if h = self.hostname.presence
      self.hostname = h.gsub(/(^https?:\/\/)|(\s+)|(\/+$)/, '')
    end
  end

end
