# A tutorial
json.type   'tutorial'
json.selector tutorial.selector
json.id     tutorial.id
json.title  tutorial.title
json.welcome  tutorial.welcome_message || ''
json.tips(tutorial.tips.sort_by_row_order) do |tip|
  json.partial! 'tip', :tip => tip
end
