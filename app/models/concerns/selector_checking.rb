module SelectorChecking
  extend ActiveSupport::Concern

  included do
    def self.noselector
      where(selector: '')
    end

    def self.withselector
      where.not(selector: '')
    end
  end
end
