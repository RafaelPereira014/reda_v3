This is the specification for returning a list of contacts made by the authenticated user on a specific resource. If is admin, will show all contacts.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/contacts/:resourceSlug`

### Headers

* **redauid** &lt;string&gt;  
   Access token to insert new data

### Arguments

Routing parameter

* **:resourceSlug** &lt;int&gt;  
   Resource slug to get contacts from

### Example Response

```
{
  "count": 6,
  "total": 6,
  "result": [
    {
      "id": 117,
      "description": "Caro utilizador, vimos por este meio agradecer a correção do recurso.",
      "user_id": 3,
      "created_at": "2018-12-07T22:12:10.000Z",
      "status": "NEW",
      "User": {
        "id": 3,
        "organization": "REDA",
        "image_id": null,
        "hidden": false,
        "name": "REDA",
        "Image": null
      }
    }
  ]
}
```