This is the specification for returning a list of taxonomies, based on search parameters.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/taxonomies/search`

### Arguments

Query string

* *limit* - optional &lt;int&gt;  
   Limit the list items (default: 9)
* *activePage* - optional &lt;int&gt;  
   Inform active page for pagination (default: 1)
* *exclude* - optional &lt;array&gt; 
  Provide an array of taxs slug to exclude from result  

### Example Response

```
{
  "page": 1,
   "totalPages": 2,
   "limit": 12,
   "count": 12,
   "total": 19,
   "result": [
      {
         "id": 5,
         "title": "Anos de Escolaridade",
         "slug": "anos_resources",
         "locked": true,
         "hierarchical": false,
         "created_at": "2019-02-04T10:37:24.000Z",
         "updated_at": "2019-03-11T16:58:31.000Z",
         "deleted_at": null,
         "type_id": 2,
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