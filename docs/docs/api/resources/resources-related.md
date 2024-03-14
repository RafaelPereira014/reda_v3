This is the specification for returning a list of related resources with a specific one, based on tags.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/resources/related/:slug`

### Arguments

Routing parameter

* **:slug** &lt;string&gt;  
   Slug of the resource in order to check if there are any related

Query string

* **limit** - optional &lt;int&gt;  
   Limit the list items (default: 8)

### Example Response

```
{
  "total": 3,
  "limit": 3,
  "result": [
    {
      "id": 162,
      "title": "Natal Chinês, de Maria Ondina Braga",
      "slug": "natal-chines-de-maria-ondina-braga",
      "description": "Exploração didática do conto, apresentado em texto e em ficheiro áudio. Clicar na segunda imagem da segunda coluna.\n",
      "highlight": false,
      "exclusive": true,
      "status": true,
      "created_at": "2016-07-24T12:30:10.000Z",
      "updated_at": "2016-07-24T12:39:32.000Z",
      "user_id": 5,
      "image_id": null,
      "Thumbnail": null,
      "Formats": [
        {
          "id": 27,
          "title": "Texto",
          "slug": "text",
          "taxonomy_id": 11,
          "image_id": 159,
          "parent_id": null,
          "type": null,
          "color": "#940808",
          "icon": null,
          "Image": {
            "id": 159,
            "name": "texto-6_1556902370336",
            "extension": "svg",
            "status": true,
            "created_at": "2019-05-03T16:52:50.000Z",
            "updated_at": "2019-05-03T16:52:50.000Z",
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
        }
      ]
    },
  ],
}
```