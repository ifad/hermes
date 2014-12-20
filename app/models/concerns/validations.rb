module Validations
  extend ActiveSupport::Concern

  included do
    validate :validate_path
  end

  protected
    # check whether there's a site defined w/ same (abs) url
    def validate_path
      site = self.try(:site) || Site.find(self.tippable_id)
      if path.present? && Site.where(hostname: site.hostname + self.path).any?
        errors.add(:path, 'you can\'t use this path. Another website is defined with this hostname+path')
      end
    end
end