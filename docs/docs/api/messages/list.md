This is the specification for returning a list default messages to use when disapproving a resource, app, tool, etc..

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/messages`

### Headers

* **redauid** &lt;string&gt;   
   Access token to insert new data

### Arguments

Query string

* **type** - optional  
   *disapprove* - Get messages used to disapprove a content  
* **content**  
   *resources* - Get messages related to resources  
   *scripts* - Get messages related to scripts (operation proposals)

### Response Dependencies

Must be an administrator.

### Example Response

```
{
  "result": [
    {
      "id": 1,
      "message": "Verifique, por favor, a correção linguística da informação introduzida inserida.",
      "type": "disapprove",
      "typeTitle": "Linguístico",
      "Type": {
        "id": 2,
        "title": "Recursos",
        "slug": "RESOURCES",
        "created_at": "2019-02-04T10:37:24.000Z",
        "updated_at": "2019-02-04T10:37:24.000Z",
        "deleted_at": null
      }
    }
  ]
}
```