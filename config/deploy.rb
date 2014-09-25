# =========================================================================
# Global Settings
# =========================================================================

# Base settings
set :application, "hermes"

# Stages settings
set :stages, %w( staging production )
set(:rails_env)     { "#{stage}" }

require 'capistrano/ext/multistage'

# Repository settings
set :repository,    "git@github.com:ifad/hermes.git"
set :scm,           "git"
set :branch,        fetch(:branch, "ifad")
set :deploy_via,    :remote_cache
set :deploy_to,     "/home/rails/apps/#{application}"
set :use_sudo,      false

# Account settings
set :user,          fetch(:user, "hermes")

ssh_options[:forward_agent] = true
ssh_options[:auth_methods]  = %w( publickey )

# =========================================================================
# Dependencies
# =========================================================================
depend :remote, :command, "gem"
depend :remote, :command, "git"

# =========================================================================
# Extensions
# =========================================================================
def compile(template)
  location = fetch(:template_dir, File.expand_path('../deploy', __FILE__)) + "/#{template}"
  config   = ERB.new File.read(location)
  config.result(binding)
end

namespace :deploy do

  desc "Restarts your application."
  task :restart, :roles => :app do
    # Signal the unicorns
    pid = "#{deploy_to}/.unicorn.pid"
    run "test -f #{pid} && kill -USR2 `cat #{pid}` || true"
  end

  task :fast do
    run "cd current && git fetch && git rebase origin/#{branch} && { kill -USR2 `cat #{deploy_to}/.unicorn.pid`; }"
  end


  namespace :ifad do
    # Harden permissions up
    on :after, :only => %w( deploy:setup deploy:create_symlink ),
      :except => { :no_release => true } do
      run '/home/rails/bin/setup_permissions'
    end

    desc '[internal] Symlink ruby version'
    task :symlink_ruby_version, :except => { :no_release => true } do
      run "ln -s #{deploy_to}/.ruby-version #{release_path}"
    end
    after 'deploy:update_code', 'deploy:ifad:symlink_ruby_version'
  end

  namespace :db do
    desc "[internal] Creates the database configuration files in shared path."
    task :setup do
      run "mkdir -p #{shared_path}/{db,config}"
      put compile('database.yml.erb'), "#{shared_path}/config/database.yml"
    end
    after "deploy:setup", "deploy:db:setup"

    desc "[internal] Updates the symlink for database configuration files to the just deployed release."
    task :symlink do
      configs = %w( database.yml ).map {|c| [shared_path, 'config', c].join('/') }
      run "test #{configs.map {|c| "-f #{c}"}.join(' -a ') }"
      run "ln -s #{configs.join(' ')} #{release_path}/config"
    end
    after "deploy:update_code", "deploy:db:symlink"

    desc "[internal] Back the database and place the backup under db/"
    task :backup do
      rake 'db:backup'
    end
  end

  namespace :assets do
    desc "[internal] Precompile assets."
    task :precompile, :roles => :web do
      run "cd #{release_path}; #{rake} assets:precompile hermes:symlink RAILS_RELATIVE_URL_ROOT=/hermes"
    end
    after "deploy:update_code", "deploy:assets:precompile"
  end

end

after 'deploy', 'deploy:cleanup'

require 'bundler/capistrano'
set :bundle_flags, "--deployment --quiet --binstubs #{deploy_to}/bin"
set :rake,         "bundle exec rake"
