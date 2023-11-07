/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bqfsbbvnw3yckpt")

  // remove
  collection.schema.removeField("lj24n9ks")

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("bqfsbbvnw3yckpt")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "lj24n9ks",
    "name": "tickets",
    "type": "relation",
    "required": false,
    "unique": false,
    "options": {
      "collectionId": "w6izlepkekugr8c",
      "cascadeDelete": false,
      "minSelect": null,
      "maxSelect": null,
      "displayFields": []
    }
  }))

  return dao.saveCollection(collection)
})
