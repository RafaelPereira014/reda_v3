This is the specification for returning a list of recent resources.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/resources/recent`

### Headers

* **redauid** - optional &lt;string&gt;  
   Access token to get full information

### Arguments

Query string

* **limit** - optional &lt;int&gt;  
   Limit the list items (default: 8)

### Response Dependencies

If there is no given token, some information will not be available, such as:

* **isFavorite**  
   Check if user has a resource as favorite

### Example Response

```
{
  "result": [
    {
      "id": 500,
      "title": "Portugal, um país a envelhecer - infografia",
      "slug": "portugal-um-pais-a-envelhecer-infografia",
      "description": "Viver mais tempo será cada vez mais comum e a Ciência fez grandes progressos para prolongar a vida humana e retardar o envelhecimento. Transplantou corações artificiais, conseguiu imprimir órgãos em tecidos biológicos, prolongou com remédios a vida de ratinhos e, geneticamente, conseguiu até rejuvenescer-lhes as células.\nQuanto tempo podemos esperar viver? E com que qualidade? Que problemas éticos estamos a enfrentar? Num país envelhecido como Portugal, como está a sociedade a mudar para responder aos desafios da longevidade?\nPara complementar a informação assista ao episódio 9, «Queremos viver para sempre?», da temporada 1, de Fronteiras XXI, emitido no dia 1 de novembro de 2017:  https://fronteirasxxi.pt/prolongamentodavida-2/",
      "highlight": false,
      "exclusive": true,
      "status": true,
      "created_at": "2018-12-17T01:44:33.000Z",
      "updated_at": "2019-02-28T17:50:51.000Z",
      "user_id": 20,
      "image_id": null,
      "duration": null,
      "isFavorite": null,
      "ratingAvg": null,
      "Thumbnail": null,
      "Formats": [
        {
          "id": 30,
          "title": "Imagem",
          "slug": "image",
          "taxonomy_id": 11,
          "image_id": 100,
          "parent_id": null,
          "type": null,
          "color": null,
          "icon": null,
          "Image": {
            "id": 100,
            "name": "imagem-1_1554388001964",
            "extension": "svg",
            "status": true,
            "created_at": "2019-04-04T14:26:42.000Z",
            "updated_at": "2019-04-04T14:26:42.000Z",
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
            },
            {
              "title": "9.º",
              "color": null
            },
            {
              "title": "10.º",
              "color": null
            },
            {
              "title": "11.º",
              "color": null
            },
            {
              "title": "12.º",
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
    },
  ]
}
```