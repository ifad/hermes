source 'https://rubygems.org'

gem 'rails', '~> 4.1.7'
gem 'devise'
gem 'bcrypt-ruby', '~> 3.0.0'
gem 'jquery-rails'
gem 'jquery-ui-rails'
gem 'turbolinks'
gem 'ranked-model', github: 'mixonic/ranked-model'
gem 'jbuilder', '~> 1.2'
gem 'uglifier', '>= 1.3.0'
# FIXME later rubyracer doesn't compile on SuSE 11.4 :-(.
# https://code.google.com/p/v8/issues/detail?id=2195
#
gem 'therubyracer', '~> 0.11.4'
gem 'less-rails'
gem 'twitter-bootstrap-rails', :git => 'git://github.com/seyhunak/twitter-bootstrap-rails.git'
gem 'bootstrap-datetimepicker-rails'
gem 'sanitize-rails'
gem 'bootstrap-wysihtml5-rails'
gem 'haml-rails'
gem 'font-awesome-rails'
gem 'data-confirm-modal', github: 'ifad/data-confirm-modal'
gem 'animate-rails'
gem 'autosize-rails'
gem 'medium-editor-rails'

group :doc do
  gem 'sdoc', require: false
end

group :development do
  gem 'mysql2'
  gem 'pry'
  gem 'pry-nav'
  gem 'pry-rails'
  gem 'capistrano', '~> 2.0'
  gem RUBY_VERSION.to_f < 2.0 ? 'debugger' : 'byebug'
end

group :production do
  gem 'unicorn'
  gem 'pg'
  gem 'exception_notification', github: 'rails/exception_notification', require: 'exception_notifier'
end
