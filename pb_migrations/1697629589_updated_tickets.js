/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6izlepkekugr8c")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "5fdkd1ns",
    "name": "amountWon",
    "type": "number",
    "required": false,
    "unique": false,
    "options": {
      "min": null,
      "max": null
    }
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6izlepkekugr8c")

  // remove
  collection.schema.removeField("5fdkd1ns")

  return dao.saveCollection(collection)
})
