module PathScoping
  extend ActiveSupport::Concern

  included do
case (adapter = ActiveRecord::Base.connection.class.name)
when /PostgreSQLAdapter/
  def self.within(path)
    where("? *~ path_re", path.presence || '/')
  end
when /Mysql2Adapter/
  def self.within(path)
    where("? REGEXP path_re", path.presence || '/')
  end
else
  raise "Your adapter #{ adapter.demodulize } is not supported yet"
end
  end
end
