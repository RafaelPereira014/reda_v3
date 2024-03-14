This is the specification for returning a generic list of tools, with data that would be retrieved with no authentication.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/tools`

### Example Response

```
{
  "result": [
    {
      "id": 1623,
      "title": "Physics notes 1",
      "slug": "physics-notes-1",
      "description": "Dicionário de bolso com vários conceitos de Física, nomeadamente: noções básicas de Física; unidades, dimensões e constantes físicas; movimento em uma, duas três dimensões; leis do movimento; atrito; gravitação; trabalho, energia e potência; leis de conservação de energia; momento e impulsão; colisões; propriedades da matéria; tensão superficial; teoria cinética dos gases; termodinâmica; oscilações e movimento harmónico simples; ondas. Gratuito e em inglês.\n",
      "operation": null,
      "operation_author": null,
      "techResources": "",
      "email": null,
      "organization": "",
      "duration": null,
      "highlight": false,
      "exclusive": false,
      "embed": null,
      "link": "www.google.com",
      "author": "",
      "approved": 0,
      "approvedScientific": 0,
      "approvedLinguistic": 0,
      "status": true,
      "accepted_terms": true,
      "created_at": "2019-05-25T10:37:26.000Z",
      "updated_at": "2019-03-26T12:50:58.000Z",
      "deleted_at": null,
      "user_id": 3,
      "type_id": 1,
      "image_id": null,
      "Terms": [
        {
          "id": 38,
          "title": "Criação de recursos",
          "slug": "criacao-de-recursos",
          "icon": null,
          "color": null,
          "type": null,
          "created_at": "2019-02-04T10:37:26.000Z",
          "updated_at": "2019-02-04T10:37:26.000Z",
          "deleted_at": null,
          "taxonomy_id": 16,
          "image_id": null,
          "parent_id": null,
          "Taxonomy": {
            "id": 16,
            "title": "Categorias",
            "slug": "categorias_tools",
            "locked": true,
            "hierarchical": true,
            "created_at": "2019-02-04T10:37:24.000Z",
            "updated_at": "2019-02-04T10:37:24.000Z",
            "deleted_at": null,
            "type_id": 1
          }
        }
      ],
      "Type": {
        "id": 1,
        "title": "Ferramentas",
        "slug": "TOOLS",
        "created_at": "2019-02-04T10:37:24.000Z",
        "updated_at": "2019-02-04T10:37:24.000Z",
        "deleted_at": null
      }
    }
  ],
}
```