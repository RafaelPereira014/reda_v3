This is the specification for returning a resource full details

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/resources/details/:slug`

### Headers

* **redauid** - optional &lt;int&gt;
   Access token to get full information

### Arguments

Routing parameter

* **:slug** &lt;string&gt;  
   Slug of the resource in order to check if there are any related

Query string

* **limit** - optional &lt;int&gt;  
   Limit the list items (default: 9)

### Response Dependencies

If there is no given token, some information will not be available, such as:

* **isFavorite**  
   Check if user has a resource as favorite
* Details of a exclusive/reserved resource  

### Example Response

```
{
  "result": {
    "id": 1,
    "title": "Constante de proporcionalidade entre peso e massa2",
    "slug": "constante-de-proporcionalidade-entre-peso-e-massa",
    "description": "Recurso multidisciplinar. Simulação simples que permite explorar a distinção entre peso e massa na Terra e na Lua. Apresenta também a representação gráfica do peso em função da massa, mostrando a proporcionalidade entre estas variáveis. Apenas permite controlar o local e a massa. Em inglês de fácil compreensão.",
    "operation": "Recurso multidisciplinar Consulte as diferentes propostas de operacionalização.",
    "operation_author": null,
    "techResources": "Adobe Flash Player",
    "email": null,
    "organization": "Compass Learning",
    "duration": null,
    "highlight": false,
    "exclusive": false,
    "embed": null,
    "link": "http://www.thelearningodyssey.com/Graphics/Content/vs/e2m/Medias/html/a222-weight-mass-on-the-moon.html",
    "author": "CompassLearning",
    "approved": 0,
    "approvedScientific": 1,
    "approvedLinguistic": 0,
    "status": true,
    "accepted_terms": true,
    "created_at": "2019-03-04T10:37:26.000Z",
    "updated_at": "2019-03-26T17:07:02.000Z",
    "deleted_at": null,
    "user_id": 5,
    "type_id": 2,
    "image_id": null,
    "ratingAvg": null,
    "ratingUsers": 0,
    "isFavorite": null,
    "didContact": 0,
    "Thumbnail": null,
    "Formats": [
      {
        "id": 24,
        "title": "Animação/Simulação",
        "slug": "animation",
        "taxonomy_id": 11,
        "image_id": 2,
        "parent_id": null,
        "type": null,
        "color": null,
        "icon": null,
        "Image": {
          "id": 2,
          "name": "animacao",
          "extension": "svg",
          "status": true,
          "created_at": "2019-02-04T10:38:52.000Z",
          "updated_at": "2019-02-04T10:38:52.000Z",
          "deleted_at": null
        },
        "Taxonomy": {
          "id": 11,
          "title": "Formato",
          "slug": "formato_resources",
          "locked": true,
          "type_id": 2
        }
      }
    ],
    "Favorites": [],
    "Files": [],
    "Scripts": [
      {
        "id": 9215,
        "title": null,
        "description": null,
        "operation": "Recurso multidisciplinar Consulte as diferentes propostas de operacionalização.",
        "approved": 1,
        "approvedScientific": 1,
        "approvedLinguistic": 1,
        "status": true,
        "main": true,
        "accepted_terms": false,
        "created_at": "2019-02-04T10:37:26.000Z",
        "updated_at": "2019-03-26T17:07:02.000Z",
        "deleted_at": null,
        "resource_id": 1,
        "user_id": 3,
        "Files": []
      }
    ],
    "User": {
      "name": "REDA",
      "organization": "REDA",
      "email": "reda_user@edu.azores.gov.pt",
      "hidden": false
    },
    "Type": {
      "id": 2,
      "title": "Recursos",
      "slug": "RESOURCES",
      "created_at": "2019-02-04T10:37:24.000Z",
      "updated_at": "2019-02-04T10:37:24.000Z",
      "deleted_at": null
    },
    "Taxonomies": [
      {
        "id": 5,
        "title": "Anos de Escolaridade",
        "slug": "anos_resources",
        "locked": true,
        "created_at": "2019-02-04T10:37:24.000Z",
        "updated_at": "2019-03-11T16:58:31.000Z",
        "type_id": 2,
        "Terms": [
          {
            "id": 5270,
            "title": "7.º",
            "slug": "7",
            "icon": null,
            "color": null,
            "image_id": null,
            "parent_id": null,
            "Image": null
          }
        ]
      },
    ]
  }
}
```