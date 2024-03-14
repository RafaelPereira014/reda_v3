This is the specification for returning a list of terms.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/terms`

### Arguments

Query string

* **type** &lt;string&gt;  
  *tools* - Get list of terms that are used in tools  
  *rec* - Get list of terms that are used in resources  
  *apps* - Get list of terms that are used in apps  
  *feedback* - Get list of terms that are used in the feedback form  
* **tax** - optional &lt;string&gt;  
  Specify the taxonomy slug that it is intended to get the terms from  
* **term** - optional &lt;string&gt;  
  Specify the term slug that it is intended to get details from  
* **required** - optional &lt;bool&gt;  
  Set to true if want to get only the terms that have any resource, app or tools associated with

### Example Response

```
{
  "result": [
    {
      "id": 5243,
      "title": "1.º",
      "slug": "1",
      "created_at": "2019-02-04T10:38:52.000Z",
      "updated_at": "2019-02-04T10:38:52.000Z",
      "parent_id": null,
      "image_id": null,
      "taxonomy_id": 5,
      "hasChild": 0,
      "hasRelationship": 1,
      "Taxonomy": {
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
    },
  ]
}
```