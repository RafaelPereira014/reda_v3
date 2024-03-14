This is the specification to set a resource availability

### Request

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/resources/approved/:id`

### Headers

* **redauid** &lt;string&gt;  
   Access token to update

### Arguments

Routing parameter

* **:id** &lt;int&gt;  
   Script id to update


JSON Body

* **status** &lt;bool&gt;  
   Set status (approved or not)
* **messagesList** - optional &lt;array&gt;  
   List of messages to send the owner if not approved
* **message** - optional &lt;string&gt;  
   Message to send the owner if not approved and is custom message

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
      "id": 2
    }
  }
}
```