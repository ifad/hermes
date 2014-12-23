json.to_view do
  json.partial! 'message', collection: @tutorials_to_view, as: :message
end
json.already_viewed do
  json.partial! 'message', collection: @tutorials_already_viewed, as: :message
end
json.with_selector do
  json.partial! 'message', collection: @tutorials_with_selector, as: :message
end