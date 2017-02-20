class CreateBookmarks < ActiveRecord::Migration[5.0]
  def change
    create_table :bookmarks, id: :uuid do |t|
      t.uuid :text_section_id, foreign_key: true
      t.uuid :user_id, foreign_key: true
      t.string :node_uuid
      t.string :node_contents
      t.boolean :automatic, default: false
    end
  end
end
