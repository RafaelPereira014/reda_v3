This is the specification for returning a list of scripts of a specific resource.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/scripts/:resourceId`

### Headers

* **redauid** - optional &lt;string&gt;  
   Access token to get full information

### Arguments

Routing parameter

* **:resourceId** &lt;int&gt;  
   Resource ID in order to get the list of scripts

### Response Dependencies

If there is no given token, the scripts will be returned only if the resource is not exclusive/reserved.

### Example Response

```
{
  "result": [
    {
      "id": 14726,
      "title": null,
      "description": null,
      "operation": "barra de led 4x4 20inchbarra de led 4x4 20inch",
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
        }
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
      "User": {
        "name": "REDA",
        "organization": "REDA",
        "email": "reda_user@azores.gov.pt",
        "hidden": false,
        "Role": {
          "id": 1,
          "value": "Utilizador",
          "type": "user"
        }
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
        {
          "id": 7,
          "title": "Disciplinas",
          "slug": "areas_resources",
          "locked": true,
          "created_at": "2019-02-04T10:37:24.000Z",
          "updated_at": "2019-02-04T10:37:24.000Z",
          "type_id": 2,
          "Terms": [
            {
              "id": 2,
              "title": "Francês",
              "slug": "frances",
              "icon": null,
              "color": null,
              "image_id": null,
              "parent_id": null,
              "Image": null
            }
          ]
        },
        {
          "id": 8,
          "title": "Domínios",
          "slug": "dominios_resources",
          "locked": true,
          "created_at": "2019-02-04T10:37:24.000Z",
          "updated_at": "2019-02-04T10:37:24.000Z",
          "type_id": 2,
          "Terms": [
            {
              "id": 8,
              "title": "A escola",
              "slug": "a-escola",
              "icon": null,
              "color": null,
              "image_id": null,
              "parent_id": null,
              "Image": null
            },
          ]
        },
        {
          "id": 9,
          "title": "Etiquetas",
          "slug": "tags_resources",
          "locked": true,
          "created_at": "2019-02-04T10:37:24.000Z",
          "updated_at": "2019-02-04T10:37:24.000Z",
          "type_id": 2,
          "Terms": [
            {
              "id": 1683,
              "title": "asd",
              "slug": null,
              "icon": null,
              "color": null,
              "image_id": null,
              "parent_id": null,
              "Image": null
            },
          ]
        }
      ]
    }
  ],
}
```