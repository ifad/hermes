# A tip without a selector is seen as a broadcast by the JS client.
#
if tip.selector.blank?
  json.type 'broadcast'
else
  json.type 'tip'
  json.selector tip.selector
end

#
json.id      tip.id
json.title   tip.title
json.content tip.content
json.path    tip.path
