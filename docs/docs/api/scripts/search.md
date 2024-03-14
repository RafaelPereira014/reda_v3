This is the specification for returning a list of scripts, based on search parameters.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/scripts/search`

### Headers

* **redauid** &lt;string&gt;  
   Access token to get full information

### Arguments

Query string

* **limit** - optional &lt;int&gt;  
   Limit the list items (default: 9)
* **activePage** - optional &lt;int&gt;  
   Inform active page for pagination (default: 1)
* **order** - optional &lt;string&gt;    
   *recent* - Most recent (DESC)  
* **type** - optional &lt;string&gt;    
   *null*: All scripts  
   *myscripts*: Scripts that the user owns
   *pending*: Scripts that are pending for approval
* **terms** - optional &lt;int&gt;    
   Array of terms IDs in order to filter the scripts based on those terms  
* **tags** - optional &lt;int&gt;    
   Array of tags strings in order to filter the scripts  
* **approval** - optional &lt;string&gt;    
   *null* - scripts that are already approved  
   *scientific* - Get scripts that are depending of scientific validation  
   *linguistic* - Get scripts that are depending of linguistic validation  

### Response Dependencies

If there is no given token, information will not be available.

### Example Response

```
{
   "page": 1,
   "totalPages": 168,
   "limit": 9,
   "count": 9,
   "total": 1508,
   "result": [
      {
         "id": 14726,
         "title": null,
         "description": null,
         "operation": "teste",
         "approved": 1,
         "approvedScientific": 1,
         "approvedLinguistic": 1,
         "status": true,
         "main": true,
         "accepted_terms": false,
         "created_at": "2019-06-13T16:23:58.000Z",
         "updated_at": "2019-06-13T16:23:58.000Z",
         "deleted_at": null,
         "resource_id": 1766,
         "user_id": 3,
         "Terms": [
            {
            "id": 2,
            "title": "Francês",
            "slug": "frances",
            "icon": null,
            "color": null,
            "type": null,
            "created_at": "2019-02-04T10:37:25.000Z",
            "updated_at": "2019-02-04T10:37:25.000Z",
            "deleted_at": null,
            "taxonomy_id": 7,
            "image_id": null,
            "parent_id": null
            },
         ],
         "Files": [
            {
               "id": 516,
               "name": "teste-13_1560443037697",
               "extension": "png",
               "status": true,
               "created_at": "2019-06-13T16:23:58.000Z",
               "updated_at": "2019-06-13T16:23:58.000Z",
               "deleted_at": null,
               "script_file": {
                  "created_at": "2019-06-13T16:23:58.000Z",
                  "updated_at": "2019-06-13T16:23:58.000Z",
                  "file_id": 516,
                  "script_id": 14726
               }
            }
         ],
         "Resource": {
            "title": "Teste",
            "description": "teste",
            "slug": "teste-13",
            "Type": {
               "id": 2,
               "title": "Recursos",
               "slug": "RESOURCES",
               "created_at": "2019-02-04T10:37:24.000Z",
               "updated_at": "2019-02-04T10:37:24.000Z",
               "deleted_at": null
            }
         },
         "User": {
            "organization": "REDA",
            "email": "reda_user@azores.gov.pt",
            "hidden": false,
            "name": "REDA"
         }
      },
   ]
}
```