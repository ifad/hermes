# vim: ft=ruby
Ifad::God.unicorn do |w|
  w.uid = 'hermes'
  w.gid = 'ruby'
  w.env = {
    #'RUBY_GC_MALLOC_LIMIT'    => 160_000_000.to_s,
    #'RUBY_GC_HEAP_INIT_SLOTS' => 600_000.to_s,
    #'RUBY_GC_HEAP_FREE_SLOTS' => 100_000.to_s,
    'RAILS_ENV'               => 'production',
    'RAILS_RELATIVE_URL_ROOT' => '',
  }
end
