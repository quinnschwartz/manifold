require "memoist"

module Validator
  # This class takes an HTML string input and validates it. In doing so, it will parse the
  # HTML and transform it into a valid HTML structure that can be consumed by the Manifold
  # frontend. This mainly involves insuring proper nesting, and making sure that the
  # structure will work with ReactDom.
  class Stylesheet

    extend Memoist

    def initialize
      @config = Rails.configuration.manifold.css_validator
    end

    # @param css [String] the CSS to be validated
    # @return [String] parsed and validated CSS
    def validate(css)
      reset
      return output unless css?(css)
      @parser.load_string!(css.dup)
      parser.each_selector(&method(:visit_selector))
      output
    end

    # Removes disallowed declarations from declarations
    # @param declarations [String]
    # @param selector [String, nil]
    # @return [String]
    def validate_declarations(declarations, selector = nil)
      cleaned = []
      parse_declarations(declarations).each_declaration do |property, value, important|
        next unless allowed_property?(property, selector)
        mapped_value = map_value(property, value)
        cleaned.push compose_declaration(property, mapped_value, important)
      end
      cleaned
    end

    private

    # @return [CssParser::Parser]
    def parser
      @parser ||= CssParser::Parser.new
    end

    # @return [String]
    def output
      @out.split("\n").map(&:squish).join("\n").strip
    end

    # Reset the validator state
    def reset
      @out = ""
      @parser = CssParser::Parser.new
    end

    # Is the css param actually css?
    # @param css [String]
    # @return [Boolean]
    def css?(css)
      return false if css.blank?
      true
    end

    # @param selector [String]
    # @param declarations [String]
    # @return [nil]
    def visit_selector(selector, declarations, *_args)
      return unless allowed_selector?(selector)
      write_rule_set(selector, declarations)
      nil
    end

    # Appends to @out
    # @param selector [String]
    # @param declarations [String]
    # @return [nil]
    def write_rule_set(selector, declarations)
      scoped_selector = scope_selector(selector)
      cleaned_declarations = validate_declarations(declarations, selector)
      @out << compose_rule_set(scoped_selector, cleaned_declarations)
      nil
    end

    # Prepares declarations for enumeration
    # @param declarations [String]
    # @return [CssParser::RuleSet]
    def parse_declarations(declarations)
      parser = CssParser::RuleSet.new(nil, declarations)
      parser.expand_shorthand!
      parser
    end

    # Composes a declaration from parts
    # @param property [String]
    # @param value [String]
    # @param _important [Boolean]
    # @return [String]
    def compose_declaration(property, value, _important)
      "#{property}: #{value};"
    end

    # Composes a CSS rule set from a selector and declarations
    # @param selector [String]
    # @param declarations [Array]
    # @return [String]
    def compose_rule_set(selector, declarations)
      <<~END
      #{selector} {
        #{declarations.join("\n")}
      }
      END
    end

    # Scopes a selector
    # @param selector [String]
    # @return [String]
    def scope_selector(selector)
      return selector if scoped?(selector)
      "#{@config.scope} #{selector}"
    end

    # Maps a CSS declaration value if necessary
    # @param value [String]
    # @param property [String]
    # @return [String]
    def map_value(property, value)
      out = value
      @config.value_maps.each do |value_map|
        next if (property =~ value_map.match).nil?
        match = value_map[:entries].detect { |kvp| out == kvp[0] }
        out = match[1] unless match.nil?
      end
      out
    end

    # Is a given property allowed generally and for the selector (if provided)?
    # @param property [String]
    # @param selector [String]
    # @return [Boolean]
    def allowed_property?(property, selector = nil)
      match = @config.exclusions.properties.detect do |exclusion|
        exclusion_matches_property?(exclusion, property, selector)
      end
      match.nil?
    end

    # Is the property excluded from the exclusion config?
    # @param exclusion [Hash]
    # @param property [String]
    # @param selector [String]
    # @return [Boolean]
    def exclusion_matches_property?(exclusion, property, selector = nil)
      return false unless exclusion.key?(:exclude)
      covered = exclusion.exclude.include? property
      return covered unless exclusion.key?(:condition)
      return covered if selector && exclusion_matches_selector?(exclusion, selector)
      false
    end

    # Does the match condition in the exclusion match the given selector?
    # @param exclusion [Hash]
    # @param selector [String]
    # @return [Boolean]
    # @raise InvalidCondition if the exclusions configuration is invalid.
    def exclusion_matches_selector?(exclusion, selector)
      return true unless exclusion.key?(:condition)
      raise InvalidCondition unless valid_selector_condition?(exclusion.condition)
      compare = selector
      compare = tag_from_selector(selector) if exclusion.condition.type == "tag"
      return false if compare.blank?
      !(compare =~ exclusion.condition.match).nil?
    end

    # Is the condition property on an exclusion configuration valid?
    # @param condition [Hash]
    # @return [Boolean]
    def valid_selector_condition?(condition)
      condition.key?(:match) && condition.key?(:type)
    end

    # Makes a rough guess at what tag is covered by a given selector. This is not a full
    # CSS selector parser. We're using regular expressions and making a best effort to
    # determine if the rule is applied globally to a tag, rather than to a tag scoped
    # by class or ID. We do this because Manifold limits what global styles can be
    # applied to tags, to improve the reading experience.
    # @param selector [String]
    # @return [String]
    def tag_from_selector(selector)
      clean = selector.gsub(/\[.*\]/, "")
      return clean if clean.blank?
      # Find last element in combinatory selectors, strip psuedo selectors.
      tag = clean.split(/(\s?[~>+]\s?|\s)/).last.split(/[:]/).first
      tag
    end
    memoize :tag_from_selector

    # Has the selector already been scoped?
    # @param selector [String]
    # @return [Boolean]
    def scoped?(selector)
      selector.start_with? @config.scope
    end

    # Is the selector allowed?
    # @param selector [String]
    # @return [Boolean]
    def allowed_selector?(selector)
      sel = selector.downcase.strip
      pattern = Regexp.union(@config.exclusions.selectors)
      (sel =~ pattern).nil?
    end

  end

  class InvalidCondition < KeyError
  end
end
