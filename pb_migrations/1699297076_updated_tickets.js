/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6izlepkekugr8c")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "qeqnkmev",
    "name": "user",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "bqfsbbvnw3yckpt",
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
  collection.schema.removeField("qeqnkmev")

  return dao.saveCollection(collection)
})
