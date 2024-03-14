This is the specification to create or update a news.

### Request

Use the **POST** method in the following URL to create:  
`https://reda-sta.azores.gov.pt/api/news/`

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/news/:slug`

### Headers

* **redauid** &lt;string&gt;   
   Access token to insert new data

### Arguments

If it is an update, must provide the routing parameter:

* **:slug** &lt;string&gt;  
   News slug reference to update

JSON Body:  

* **title** &lt;string&gt;  
   News title
* **description** &lt;string&gt;  
   News description  
* **thumbnail** &lt;obj&gt;  
   Image object with `data`, `size` and `extension` properties.  
   You can also add the `id` property to avoid create a new image that already exists.

#### Example request body
```
{
   "id": 1,
   "title": "Foo Bar",
   "description": "Foo Bar",
   "thumbnail": [
      "id": null,
      "name": "foo bar file",
      "extension": "jpg",
      "data": <base64>,
      "size": 25261
   ]
}
```

### Response Dependencies

Must be an administrator.

### Example Response

```
{
  "result": {
      "id": 110,
      "title": "Foo Bar",
      "slug": "foo-bar",
      "description": "Foo Bar",
      "user_id": 1,
      "Image": {
         "id": 1,
         "name": "foo bar file",
         "extension": "jpg",
         "status": true,
         "created_at": "2019-04-04T14:26:42.000Z",
         "updated_at": "2019-04-04T14:26:42.000Z",
         "deleted_at": null
      }
  }
}
```