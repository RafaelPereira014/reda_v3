This is the specification for returning a generic list of tools that were added in the current month.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/tools/month`

### Arguments

Query string

* **limit** - optional &lt;int&gt;  
   Limit the list items (default: 9)
* **activePage** - optional &lt;int&gt;  
   Inform active page for pagination (default: 1)

### Example Response

```
{
    "page": 1,
    "totalPages": 1,
    "limit": 9,
    "count": 1,
    "total": 1,
    "result": [
        {
            "id": 1623,
            "title": "Physics notes 1",
            "slug": "physics-notes-1",
            "description": "Dicionário de bolso com vários conceitos de Física, nomeadamente: noções básicas de Física; unidades, dimensões e constantes físicas; movimento em uma, duas três dimensões; leis do movimento; atrito; gravitação; trabalho, energia e potência; leis de conservação de energia; momento e impulsão; colisões; propriedades da matéria; tensão superficial; teoria cinética dos gases; termodinâmica; oscilações e movimento harmónico simples; ondas. Gratuito e em inglês.\n",
            "highlight": false,
            "exclusive": false,
            "status": true,
            "created_at": "2019-06-05T11:26:39.000Z",
            "updated_at": "2019-02-25T13:29:01.000Z",
            "user_id": 5,
            "image_id": null,
            "duration": null,
            "User": {
                "id": 5,
                "name": "REDA"
            }
        }
    ]
}
```