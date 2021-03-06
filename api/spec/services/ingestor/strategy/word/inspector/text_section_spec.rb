require "rails_helper"

RSpec.describe Ingestor::Strategy::Word::Inspector::TextSection do

  include_context("word ingestion")

  klass = Ingestor::Strategy::Word::Inspector::TextSection

  let(:source_a) { "/some/path.html" }
  let(:source_b) { "/some/other/path.html" }
  let(:word_inspector_a) { word_inspector(source_a) }
  let(:word_inspector_b) { word_inspector(source_b) }

  let(:subject_a) { klass.new(source_a, word_inspector_a) }
  let(:subject_b) { klass.new(source_b, word_inspector_b) }

  it "returns different IDs based for different paths" do
    id_a = subject_a.source_identifier
    id_b = subject_b.source_identifier
    expect(id_a).to_not eq id_b
  end

  it "returns a stable ID if the path doesn't change" do
    id_a = subject_a.source_identifier
    id_b = subject_a.source_identifier
    expect(id_a).to eq id_b
  end

  it "returns body content of html file" do
    html_a = subject_a.source_body
    expect(html_a).to start_with("<body>")
    expect(html_a).to end_with("</body>")
  end

  it "always returns kind of section" do
    expect(subject_a.kind).to eq ::IngestionSource::KIND_SECTION
  end


end

