This is the specification for returning a tool full details.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/tools/details/:slug`

### Arguments

Routing parameter

* **:slug** &lt;string&gt;  
   Slug of the tool

### Example Response

```
{
  "result": {
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
    "approvedScientific": 1,
    "approvedLinguistic": 0,
    "status": true,
    "accepted_terms": true,
    "created_at": "2019-05-25T10:37:26.000Z",
    "updated_at": "2019-06-14T16:53:10.000Z",
    "deleted_at": null,
    "user_id": 3,
    "type_id": 1,
    "image_id": null,
    "Type": {
      "id": 1,
      "title": "Ferramentas",
      "slug": "TOOLS",
      "created_at": "2019-02-04T10:37:24.000Z",
      "updated_at": "2019-02-04T10:37:24.000Z",
      "deleted_at": null
    },
    "Taxonomies": [
      {
        "id": 16,
        "title": "Categorias",
        "slug": "categorias_tools",
        "locked": true,
        "created_at": "2019-02-04T10:37:24.000Z",
        "updated_at": "2019-02-04T10:37:24.000Z",
        "type_id": 1,
        "Terms": [
        {
            "id": 38,
            "title": "Criação de recursos",
            "slug": "criacao-de-recursos",
            "icon": null,
            "color": null,
            "image_id": null,
            "parent_id": null,
            "Image": null,
            "metadata": null
          }
        ]
      }
    ]
  }
}
```