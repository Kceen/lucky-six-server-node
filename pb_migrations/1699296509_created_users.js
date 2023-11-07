/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "a31oy5wrp2ljmu6",
    "created": "2023-11-06 18:48:29.535Z",
    "updated": "2023-11-06 18:48:29.535Z",
    "name": "users",
    "type": "auth",
    "system": false,
    "schema": [],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "allowEmailAuth": true,
      "allowOAuth2Auth": true,
      "allowUsernameAuth": true,
      "exceptEmailDomains": null,
      "manageRule": null,
      "minPasswordLength": 8,
      "onlyEmailDomains": null,
      "requireEmail": false
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("a31oy5wrp2ljmu6");

  return dao.deleteCollection(collection);
})
