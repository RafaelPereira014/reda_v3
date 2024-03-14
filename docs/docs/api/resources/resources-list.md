This is the specification for returning a generic list of resources, with data that would be retrieved with no authentication.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/resources`

### Example Response

```
{
  "result": [
    {
      "title": "Como reciclar",
      "slug": "como-reciclar",
      "description": "Infografia sobre reciclagem.",
      "highlight": false,
      "exclusive": false,
      "status": true,
      "created_at": "2016-08-08T21:47:48.000Z",
      "updated_at": "2016-08-23T14:03:08.000Z",
      "user_id": 5
    }
  ]
}
```