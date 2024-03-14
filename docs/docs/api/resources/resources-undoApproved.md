This is the specification to undo a resource availability action

### Request

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/resources/approved/:id/undo`

### Headers

* **redauid** &lt;string&gt;  
   Access token to update

### Arguments

Routing parameter

* **:id** &lt;int&gt;  
   Resource id to update


JSON Body

* **data** &lt;obj&gt;  
   Previous data in order to recover from action. Should have the following structure:
```
{
   "data": {
      "approvedScientific": <int>,
      "approvedLinguistic": <int>,
      "approved": <int>,
      "status": <int>
   } 
}
```
### Example Response

```
{
  "result": {
    "id": 8,
    "title": "Foo",
    "slug": "foo-bar",
    "description": "Foo bar",
    "operation": "Foo bar",
    "operation_author": "foo",
    "techResources": "foo",
    "author": "foo",
    "email": "foo@foo.com",
    "organization": "foo",
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
    "format_id": 1,
    "user_id": 2,
    "User": {
      "id": 2,
      "email": "foo@foo.com"
    }
  }
}
```