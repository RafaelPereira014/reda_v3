This is the specification for returning a list of resources marked as highlight.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/resources/highlight`

### Example Response

```
{
  "result": [
    {
      "id": 412,
      "title": "Solução, solvente e soluto ",
      "slug": "soluco-solvente-e-soluto",
      "description": "Pequeno vídeo que permite associar o termo solução a uma mistura homogénea (sólida, líquida ou gasosa), de duas ou mais substâncias, em que uma se designa por solvente e a(s) outra(s) por soluto(s). Permite também identificar o solvente e o(s) soluto(s) em soluções aquosas.\n",
      "highlight": true,
      "exclusive": true,
      "status": true,
      "created_at": "2016-08-08T21:45:20.000Z",
      "updated_at": "2016-08-31T14:26:48.000Z",
      "user_id": 5,
      "ratingAvg": null,
      "Formats": [
        {
          "id": 25,
          "title": "Áudio",
          "slug": "audio",
          "taxonomy_id": 11,
          "image_id": 3,
          "parent_id": null,
          "type": null,
          "color": null,
          "icon": null,
          "Image": {
            "id": 3,
            "name": "audio",
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
      "Type": {
          "id": 2,
          "title": "Recursos",
          "slug": "RESOURCES",
          "created_at": "2019-02-04T10:37:24.000Z",
          "updated_at": "2019-02-04T10:37:24.000Z",
          "deleted_at": null
      }
    }
  ]
}
```