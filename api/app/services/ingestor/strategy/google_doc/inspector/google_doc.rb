require "fileutils"
require "zip"
require "memoist"
require "uri"
require "open-uri"
require "json"
require "pathname"
require "digest/md5"

module Ingestor
  module Strategy
    module GoogleDoc
      module Inspector
        class GoogleDoc

          include Ingestor::Loggable
          include Ingestor::Inspector::Helpers
          include Ingestor::Inspector::HTML::HTML
          extend Memoist

          def initialize(path, logger = nil)
            @doc_path = path
            @session = ::Factory::DriveSession.create_service_account_session
            @html_path = "tmp/#{title}.html"
            @logger = logger
          end

          # returns md5 hash of file contents
          def unique_id
            Digest::MD5.hexdigest(fetch_file.id)
          end

          def google_doc?
            @logger.debug(@doc_path)
            @doc_path.include?("docs.google") ? start_ingestion : false
          end

          def start_ingestion
            fetch_file
            create_temp_html
          end

          def title
            fetch_file.title.titleize
          end

          def date
            fetch_file.modified_time
          end

          def create_temp_html
            File.open(@html_path, "w+") do |f|
              f.write(fetch_html)
            end
          end
          memoize :create_temp_html

          def ingestion_source_path
            @html_path
          end

          def ingestion_source
            [ingestion_source_path]
          end

          # rubocop:disable Metrics/LineLength
          def ingestion_source_inspectors
            ingestion_source.map do |source|
              ::Ingestor::Strategy::GoogleDoc::Inspector::IngestionSource.new(source, self)
            end
          end
          # rubocop:enable Metrics/LineLength

          def text_section_inspectors
            ingestion_source.map do |path|
              ::Ingestor::Strategy::GoogleDoc::Inspector::TextSection.new(path, self)
            end
          end

          def stylesheet_inspectors
            [
              ::Ingestor::Strategy::GoogleDoc::Inspector::Stylesheet.new(
                stylesheet,
                self
              )
            ]
          end

          def fetch_file
            @session.file_by_url(@doc_path)
          end
          memoize :fetch_file

          def fetch_html
            @session.drive.export_file(fetch_file.id, "text/html")
          end
          memoize :fetch_html

          def remove_tmp
            FileUtils.rm_rf(@html_path)
          end

        end
      end
    end
  end
end
