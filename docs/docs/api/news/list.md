This is the specification for returning a list of news.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/news`

### Arguments

Query string

* **limit** - optional &lt;int&gt;  
   Limit the list items (default: 9)
* **activePage** - optional &lt;int&gt;  
   Inform active page for pagination (default: 1)

### Example Response

```
{
  "page": 1,
  "totalPages": 1,
  "limit": 9,
  "count": 3,
  "total": 3,
  "result": [
    {
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
    },
  ]
}
```