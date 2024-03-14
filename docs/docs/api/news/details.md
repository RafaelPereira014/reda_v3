This is the specification for returning news details.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/news/:slug`

### Arguments

Routing parameter

* **:slug** &lt;string&gt;  
   News slug

### Example Response

```
{
  "result": {
    "id": 3,
    "title": "Foo Bar",
    "slug": "foo-bar",
    "description": "Foo bar",
    "status": true,
    "created_at": "2019-04-03T12:13:40.000Z",
    "updated_at": "2019-04-04T10:37:42.000Z",
    "deleted_at": null,
    "image_id": 155,
    "user_id": 3,
    "Thumbnail": {
      "id": 155,
      "name": "foo-bar_thumb_1554293620407",
      "extension": "png",
      "status": true,
      "created_at": "2019-04-03T12:13:40.000Z",
      "updated_at": "2019-04-03T12:13:40.000Z",
      "deleted_at": null
    },
    "User": {
      "name": "REDA",
      "email": "reda_user@azores.gov.pt"
    }
  }
}
```