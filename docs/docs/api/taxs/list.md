This is the specification for returning a list of taxonomies.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/taxonomies`

### Arguments

Query string

* **scope** - optional &lt;string&gt;  
  Set scope to retrieve the taxs, such as **pending**.  
* **type** &lt;string&gt;  
  *tools* - Get list of terms that are used in tools  
  *rec* - Get list of terms that are used in resources  
  *apps* - Get list of terms that are used in apps  
  *feedback* - Get list of terms that are used in the feedback form  
  *scripts* - Get list of taxonomies that are used in scripts (operation propostals)  
* **required** - optional &lt;bool&gt;  
  If true, return only taxonomies and terms that have an association with some resource, tool, app, etc.  
* **taxs** - optional &lt;array&gt;  
  Provide an array of taxs slug to filter  
* **terms** - optional &lt;bool&gt;  
  If true, return taxonomies and the terms  
* **exclude** - optional &lt;array&gt;  
  Provide an array of taxs slug to exclude from result  
* **include** - optional &lt;array&gt;  
  Provide an array of taxs slug to include in the result  

### Example Response

```
{
  "result": [
    {
      "id": 5,
      "title": "Anos de Escolaridade",
      "slug": "anos_resources",
      "created_at": "2019-02-04T10:37:24.000Z",
      "updated_at": "2019-03-11T16:58:31.000Z",
      "type_id": 2,
      "Terms": [
        {
          "id": 6700,
          "title": "Nível A1",
          "slug": "nivel-a1",
          "icon": null,
          "color": null,
          "type": null,
          "created_at": "2019-04-23T14:45:50.000Z",
          "updated_at": "2019-04-23T14:45:50.000Z",
          "deleted_at": null,
          "taxonomy_id": 5,
          "image_id": null,
          "parent_id": null,
          "hasResources": 0,
          "hasScripts": 1,
          "Relationship": [
            {
              "id": 7178,
              "terms_relation": {
                "level": 2
              }
            },
            {
              "id": 7179,
              "terms_relation": {
                "level": 2
              }
            }
          ]
        }
      ]
    }
  ]
}
```