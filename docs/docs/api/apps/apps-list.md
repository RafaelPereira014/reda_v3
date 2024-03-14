This is the specification for returning a generic list of applications, with data that would be retrieved with no authentication.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/apps`

### Example Response

```
{
  "result": [
    {
      "id": 1752,
      "title": "\t Educação para a Cidadania",
      "slug": "educaco-para-a-cidadania",
      "description": "O projeto apresenta-se como um serviço a prestar à comunidade tendo como missão aumentar os níveis de cidadania participativa das crianças e dos jovens, mobilizando uma rede social e comunitária em prol da construção de uma sociedade melhor.\n\nNas temáticas Educação Ambiental, Desenvolvimento Sustentável e Educação para a Saúde os alunos vão explorar, de forma ativa e lúdica, conteúdos e ações que contribuem para o seu desenvolvimento e para a construção de uma sociedade mais solidária e participativa.",
      "link": null,
      "Images": [
        {
          "id": 140,
          "name": "educaco-para-a-cidadania_1539348720035",
          "extension": "jpg",
          "status": true,
          "created_at": "2018-10-12T12:52:00.000Z",
          "updated_at": "2018-10-12T12:52:00.000Z",
          "deleted_at": null,
          "resource_image": {
            "created_at": "2019-02-04T10:39:39.000Z",
            "updated_at": "2019-02-04T10:39:39.000Z",
            "image_id": 140,
            "resource_id": 1752
          }
        }
      ],
      "Terms": [
        {
          "id": 4036,
          "title": "comunidade",
          "slug": null,
          "taxonomy_id": 4,
          "image_id": null,
          "parent_id": null,
          "Taxonomy": {
            "id": 4,
            "title": "Etiquetas",
            "slug": "tags_apps",
            "locked": true,
            "type_id": 3,
            "Type": {
              "id": 3,
              "title": "Aplicações",
              "slug": "APPS"
            }
          }
        },
        {
          "id": 4650,
          "title": "educação ambiental ",
          "slug": null,
          "taxonomy_id": 4,
          "image_id": null,
          "parent_id": null,
          "Taxonomy": {
            "id": 4,
            "title": "Etiquetas",
            "slug": "tags_apps",
            "locked": true,
            "type_id": 3,
            "Type": {
              "id": 3,
              "title": "Aplicações",
              "slug": "APPS"
            }
          }
        },
      ],
      "Type": {
        "id": 3,
        "title": "Aplicações",
        "slug": "APPS",
        "created_at": "2019-02-04T10:37:24.000Z",
        "updated_at": "2019-02-04T10:37:24.000Z",
        "deleted_at": null
      }
    }
  ]
}
```