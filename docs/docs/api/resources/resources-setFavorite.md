This is the specification to set a resource as favorite

### Request

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/resources/favorite/:id`

### Headers

* **redauid** &lt;string&gt;  
   Access token to update

### Arguments

Routing parameter

* **:id** &lt;int&gt;  
   Resource id to update

### Example Response

```
{
  "result": {
    "id": 8,
    "title": "Foo",
    "slug": "foo-bar",
    "description": "Foo Bar",
    "techResources": "foo",
    "author": "foo",
    "email": "foo@foo.com",
    "organization": "foo bar",
    "duration": null,
    "highlight": false,
    "exclusive": false,
    "embed": null,
    "link": "foo",
    "approved": 1,
    "status": true,
    "created_at": "2016-06-08T14:55:43.000Z",
    "updated_at": "2016-08-31T16:21:44.000Z",
    "deleted_at": null,
    "user_id": 2,
    "Favorites": []
  }
}
```