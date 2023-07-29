migrate((db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6izlepkekugr8c")

  // add
  collection.schema.addField(new SchemaField({
    "system": false,
    "id": "scmmopi6",
    "name": "active",
    "type": "bool",
    "required": false,
    "unique": false,
    "options": {}
  }))

  return dao.saveCollection(collection)
}, (db) => {
  const dao = new Dao(db)
  const collection = dao.findCollectionByNameOrId("w6izlepkekugr8c")

  // remove
  collection.schema.removeField("scmmopi6")

  return dao.saveCollection(collection)
})
