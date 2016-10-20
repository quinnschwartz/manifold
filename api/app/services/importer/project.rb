require "json"

module Importer
  # This class imports a project.json file into Manifold
  class Project
    def initialize(path)
      @path = path
      @project_json = read_json("project.json")
    end

    def import(include_texts = true)
      upsert_project(include_texts)
    end

    private

    # rubocop:disable Metrics/AbcSize
    def upsert_project(include_texts)
      project = ::Project.find_or_create_by(hashtag: @project_json[:attributes][:hashtag])
      project.update(@project_json[:attributes])
      set_attachment(project, :cover, @project_json[:cover])
      set_attachment(project, :hero, @project_json[:hero])
      set_attachment(project, :avatar, @project_json[:avatar])
      excludes = %w(cover_ avatar_ hero_)
      excludes << "published_text_id" unless include_texts
      unset_untouched(project, @project_json[:attributes], excludes)
      project.save

      import_collaborators(project)
      import_published_text(project, @project_json[:published_text]) if include_texts
    end
    # rubocop:enable Metrics/AbcSize

    def import_collaborators(project)
      makers_json = @project_json.dig(:relationships, :makers)
      return unless makers_json
      touched_collaborator_ids = []
      makers_json.each do |maker_json|
        collaborator = upsert_maker(maker_json)
        touched_collaborator_ids << collaborator.id
        project.collaborators.where.not(id: touched_collaborator_ids).destroy_all
      end
    end

    def upsert_maker(maker_json)
      maker_attr = maker_json[:attributes].clone
      role = maker_attr[:role]
      maker_attr.delete(:role)
      maker = Maker.find_or_create_by(
        name: maker_attr[:name]
      )
      maker.update(maker_attr)
      set_attachment(maker, :avatar, maker_json[:avatar])
      maker.save
      collaborator = project.collaborators.find_or_create_by(
        maker_id: maker.id,
        role: role
      )
      collaborator
    end

    def import_published_text(project, text_file_name)
      text_path = "#{@path}/texts/#{text_file_name}"
      Ingestor.logger = Logger.new(STDOUT)
      text = Ingestor.ingest(text_path)
      Ingestor.reset_logger
      text.project = project
      project.published_text = text
      text.save
      project.save
    end

    def unset_untouched(model, attributes, exclude = [])
      exclude << "id"
      exclude << "created_at"
      exclude << "updated_at"
      fields = model.class.column_names.map(&:to_sym)
      touched = attributes.keys
      unset = (fields - touched).reject do |key|
        key.to_s.start_with?(*exclude)
      end
      unset.each do |key|
        model.send("#{key}=", nil)
      end
    end

    def set_attachment(model, key, value)
      if value.blank?
        model.send(key.to_s).clear
      else
        model.send("#{key}=", open_file(value))
      end
    end

    def open_file(file)
      File.open(path_for(file))
    end

    def read_file(file)
      File.read(path_for(file))
    end

    def path_for(file)
      "#{@path}/#{file}"
    end

    def read_json(file)
      JSON.parse(read_file(file)).deep_symbolize_keys
    end
  end
end