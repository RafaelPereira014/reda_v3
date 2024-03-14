This is the specification for returning a list of applications, based on search parameters.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/apps/search`

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
* **system** - optional &lt;int&gt;  
   Systems ID for filtering
* **approval** - optional &lt;string&gt;    
   *null* - Resources that are already approved  
   *scientific* - Get resources that are depending of scientific validation  
   *linguistic* - Get resources that are depending of linguistic validation
* **type** - optional &lt;string&gt;    
   *null* - All apps in default scope  
   *myapps* - Apps that the user owns  
   *pending* - Apps awaiting for approval  
   *all* - Get all apps despite the approval stage
* **order** - optional &lt;string&gt;   
   *recent* - Most recent (DESC)

### Response Dependencies

If there is no given token, some information will not be available, such as:

* List of apps that the user owns
* List of apps despite the approval stage
* Apps awaiting for approval

### Example Response

```
{
  "page": 1,
  "totalPages": 10,
  "limit": 9,
  "count": 9,
  "total": 82,
  "result": [
    {
      "id": 110,
      "title": "Learn Physics",
      "description": "É uma aplicação que ajuda a compreender determinados fenómenos da Física, de forma fácil e rápida. Possui vários tutoriais, uma calculadora, formulários e problemas para praticar. Gratuito e em inglês.\n",
      "slug": "learn-physics",
      "link": null,
      "image_id": 13,
      "created_at": "2016-07-22T00:28:07.000Z",
      "Image": {
        "id": 13,
        "name": "learn-physics_1472569867274",
        "extension": "jpg",
        "status": true,
        "created_at": "2016-08-30T15:11:07.000Z",
        "updated_at": "2016-08-30T15:11:07.000Z",
        "deleted_at": null
      },
      "Systems": [
        {
          "id": 2,
          "title": "Android",
          "icon": "android",
          "status": true,
          "created_at": "2016-07-14T11:43:10.000Z",
          "updated_at": "2016-07-14T11:43:10.000Z",
          "deleted_at": null,
          "app_system": {
            "link": "https://play.google.com/store/apps/details?id=com.iphonedevro.learnphysics ",
            "created_at": "2016-08-30T15:11:07.000Z",
            "updated_at": "2016-08-30T15:11:07.000Z",
            "app_id": 110,
            "system_id": 2
          }
        }
      ]
    }
  ]
}
```