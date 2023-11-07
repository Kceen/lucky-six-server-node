/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "bqfsbbvnw3yckpt",
    "created": "2023-11-06 18:54:28.374Z",
    "updated": "2023-11-06 18:54:28.374Z",
    "name": "users",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "9coizxy5",
        "name": "username",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "p4lwmdul",
        "name": "password",
        "type": "text",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "3ezyctiw",
        "name": "money",
        "type": "number",
        "required": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null
        }
      },
      {
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
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("bqfsbbvnw3yckpt");

  return dao.deleteCollection(collection);
})
