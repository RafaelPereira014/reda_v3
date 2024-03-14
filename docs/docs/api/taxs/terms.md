This is the specification for returning a list of terms for a specific taxonomy.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/taxonomies/:slug/terms`

### Arguments

Routing parameter

* *:slug* &lt;string&gt;  
   Slug of the taxonomy

Query string

* *limit* - optional &lt;int&gt;  
   Limit the list items (default: 9)  
* *activePage* - optional &lt;int&gt;  
   Inform active page for pagination (default: 1)  
* *all* - optional &lt;bool&gt; 
  Choose to the list with or without pagination.   

### Example Response

```
{
  "page": 1,
  "totalPages": 2,
  "limit": 9,
  "count": 9,
  "total": 16,
  "result": [
    {
      "id": 5243,
      "title": "1.º",
      "slug": "1-12",
      "icon": null,
      "color": null,
      "type": null,
      "created_at": "2019-02-04T10:38:52.000Z",
      "updated_at": "2019-02-04T10:38:52.000Z",
      "deleted_at": null,
      "taxonomy_id": 5,
      "image_id": null,
      "parent_id": null,
      "Image": null
    }
  ]
}
```