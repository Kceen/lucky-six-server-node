/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6izlepkekugr8c")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "cdaotnjy",
    "name": "field",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "_pb_users_auth_",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": 1,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6izlepkekugr8c")

  // remove
  collection.schema.removeField("cdaotnjy")

  return dao.saveCollection(collection)
})
