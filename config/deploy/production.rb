httper = 'redgem.ifad.org'

# machines on which the code is deployed
role :app,    httper

# machines that serve HTTP requests
role :web,    httper

# machines on which migrations are run
role :db,     httper, :primary => true # set to false to not migrate
