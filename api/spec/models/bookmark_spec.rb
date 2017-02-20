require "rails_helper"

RSpec.describe Bookmark, type: :model do

  context "user created bookmark" do

    it "has a valid bookmark factory" do
      expect(FactoryGirl.build(:bookmark)).to be_valid
    end

    it "is invalid without a user" do
      expect(FactoryGirl.build(:bookmark, user: nil)).to_not be_valid
    end

    it "is invalid without a text_section" do
      expect(FactoryGirl.build(:bookmark, text_section: nil)).to_not be_valid
    end
  end

  context "automatically created bookmark" do
    it "has a valid automatic bookmark factory" do
      expect(FactoryGirl.build(:automatic_bookmark)).to be_valid
    end

    it "only allows one automatic bookmark per user" do
      user = FactoryGirl.create(:user)
      FactoryGirl.create(:automatic_bookmark, user: user)
      expect(FactoryGirl.build(:automatic_bookmark, user: user)).to_not be_valid
    end
  end


end
