require "rails_helper"

RSpec.describe "My Bookmarks API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:text_section) { FactoryGirl.create(:text_section) }
  let(:path) { api_v1_me_relationships_bookmarks_path }
  let(:bookmark_params) {
    {
      attributes: FactoryGirl.attributes_for(:bookmark)
                             .merge(text_section_id: text_section.id)
    }
  }

  describe "sends my bookmarks" do

    before(:each) { get path, headers: reader_headers }
    let(:api_response) { JSON.parse(response.body) }

    describe "the response" do

      it "includes an array of data" do
        expect(api_response["data"]).to be_instance_of Array
      end
      it "has a 200 status code" do
        expect(response).to have_http_status(200)
      end

    end
  end

  describe "creates a bookmark" do
    before(:each) { post path, headers: reader_headers, params: json_payload(bookmark_params) }

    describe "the response" do
      it "has a 201 status code" do
        expect(response).to have_http_status(201)
      end
    end
  end
end
