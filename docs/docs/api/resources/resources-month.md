This is the specification for returning a generic list of resources that were added in the current month.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/resources/month`

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
    "count": 1,
    "total": 1,
    "result": [
        {
            "id": 1,
            "title": "Como reciclar",
            "slug": "como-reciclar",
            "description": "Infografia sobre reciclagem.",
            "highlight": false,
            "exclusive": true,
            "status": true,
            "created_at": "2019-06-11T13:30:07.000Z",
            "updated_at": "2019-03-25T13:30:07.000Z",
            "user_id": 10,
            "image_id": 500,
            "duration": null,
            "User": {
                "id": 10,
                "name": "Utilizador"
            },
            "Type": {
                "id": 20,
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