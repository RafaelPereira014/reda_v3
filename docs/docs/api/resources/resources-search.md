This is the specification for returning a list of resources, based on search parameters.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/resources/search`

### Headers

* **redauid** (optional)  
   Access token to get full information

### Arguments

Query string

* **limit** - optional &lt;int&gt;  
   Limit the list items (default: 9)
* **activePage** - optional &lt;int&gt;  
   Inform active page for pagination (default: 1)
* **terms** - optional &lt;array&gt;  
   Array of terms IDs for filtering
* **tags** - optional &lt;array&gt;  
   Array of tags text for filtering  
* **approval** - optional &lt;string&gt;    
   *null* - Resources that are already approved  
   *scientific* - Get resources that are depending of scientific validation  
   *linguistic* - Get resources that are depending of linguistic validation  
* **order** - optional &lt;string&gt;    
   *recent* - Most recent (DESC)  
   *rating--desc* - Descending based on rating  
* **type** - optional &lt;string&gt;    
   *null* - All resources  
   *myresources* - Resources that the user owns  
   *resourceswithmyscripts* - List of resources that the user contributed with scripts    
   *pending* - Resources awaiting for approval  
   *myfavorites* - User favorite resources

### Response Dependencies

If there is no given token, some information will not be available, such as:

* **isFavorite**  
   Check if user has a resource as favorite
* List of favorites
* List of resources that the user owns
* List of resources that the user contributed with scripts
* Resources awaiting for approval

### Example Response

```
{
  "page": 1,
  "totalPages": 39,
  "limit": 9,
  "count": 9,
  "total": 348,
  "result": [
      {
         "id": 413,
         "title": "Como reciclar",
         "slug": "como-reciclar",
         "description": "Infografia sobre reciclagem.\n",
         "highlight": false,
         "exclusive": true,
         "status": true,
         "approved": 1,
         "created_at": "2016-08-08T21:47:48.000Z",
         "updated_at": "2016-08-31T14:26:49.000Z",
         "user_id": 5,
         "ratingAvg": null,
         "User": {
            "id": 5,
            "email": "reda_user@edu.azores.gov.pt",
            "name": "REDA",
            "organization": "REDA"
         },
         "Formats": [
            {
               "id": 26,
               "title": "Imagem",
               "slug": "image",
               "icon": null,
               "color": null,
               "type": null,
               "created_at": "2019-02-04T10:37:26.000Z",
               "updated_at": "2019-04-04T14:26:42.000Z",
               "deleted_at": null,
               "taxonomy_id": 11,
               "image_id": 158,
               "parent_id": null,
               "resource_term": {
                  "metadata": null,
                  "created_at": "2019-02-04T15:09:31.000Z",
                  "updated_at": "2019-02-04T15:09:31.000Z",
                  "resource_id": 1621,
                  "term_id": 26
               },
               "Taxonomy": {
                  "id": 11,
                  "title": "Formato",
                  "slug": "formato_resources",
                  "locked": true,
                  "type_id": 2
               },
               "Image": {
                  "id": 158,
                  "name": "imagem-1_1554388001964",
                  "extension": "svg",
                  "status": true,
                  "created_at": "2019-04-04T14:26:42.000Z",
                  "updated_at": "2019-04-04T14:26:42.000Z",
                  "deleted_at": null
               }
            }
         ],
         "Type": {
            "id": 2,
            "title": "Recursos",
            "slug": "RESOURCES",
            "created_at": "2019-02-04T10:37:24.000Z",
            "updated_at": "2019-02-04T10:37:24.000Z",
            "deleted_at": null
         },
         "Metadata": [
            {
               "taxonomy": "anos_resources",
               "Terms": [
                  {
                     "title": "7.º",
                     "color": null
                  }
               ]
            },
            {
               "taxonomy": "macro_areas_resources",
               "Terms": [
                  {
                     "title": "Cálculo",
                     "color": null
                  }
               ]
            }
         ]
      }
   ]
}
```