module PathValidations
  extend ActiveSupport::Concern

  included do
    before_save :check_path_re
    validate :validate_path
  end

  protected
    # check whether there's a site defined w/ same (abs) url
    def validate_path
      site = self.try(:site) || (self.tippable_type == 'Site' ? Site.find(self.tippable_id) : nil)
      if site && path.present? && Site.where(hostname: site.hostname + self.path).any?
        errors.add(:path, 'you can\'t use this path. Another website is defined with this hostname+path')
      end
    end

    # if path_regexp is not modified or empty and path is filled
    def check_path_re
      check = (self.path_re == '^/$' || self.path_re == '') && self.path != "/" && self.path != ""
      self.path_re = "^#{self.path.gsub(/(\^+)|(\$+)/, '')}$" if check
    end
end