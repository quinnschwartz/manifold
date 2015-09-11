require 'memoist'
require 'naught'

module Ingestor
  module Strategy
    module EPUB3
      module Inspector
        class SpineItem

          extend Memoist

          def initialize(node)
            @node = node || Naught.build
          end

          def idref
            attribute('idref').value
          end
          memoize :idref

          def id
            attribute('id').value
          end
          memoize :id

          private

          def attribute(name)
            out = @node.attribute(name) || Naught.build
          end

        end
      end
    end
  end
end