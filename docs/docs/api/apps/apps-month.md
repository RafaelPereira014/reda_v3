This is the specification for returning a generic list of applications that were added in the current month.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/apps/month`

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
            "id": 1758,
            "title": "Sound Meter & Noise Detector",
            "slug": "sound-meter-noise-detector",
            "description": "Um sonómetro, decibelímetro (dB) ou medidor de nível de pressão sonora é um aparelho que mede o nível de ruído ambiente. A aplicação usa o microfone do seu aparelho para realizar esta medição, mostrando um intervalo de valores de referência (segundo a Associação Americana de Audiologia) para a situação em causa.",
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
            },
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