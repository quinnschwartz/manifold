FactoryGirl.define do
  factory :bookmark do
    node_uuid "1"
    node_contents "test test test"
    user
    association :text_section, factory: :text_section
  end

  factory :automatic_bookmark, parent: :bookmark do
    automatic true
  end
end
