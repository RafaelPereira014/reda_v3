This is the specification for returning an application full details.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/apps/details/:slug`

### Arguments

Routing parameter

* **:slug** &lt;string&gt;  
   Slug of the app

### Example Response

```
{
  "result": {
    "id": 1758,
    "title": "Sound Meter & Noise Detector",
    "slug": "sound-meter-noise-detector",
    "description": "Um sonómetro, decibelímetro (dB) ou medidor de nível de pressão sonora é um aparelho que mede o nível de ruído ambiente. A aplicação usa o microfone do seu aparelho para realizar esta medição, mostrando um intervalo de valores de referência (segundo a Associação Americana de Audiologia) para a situação em causa.",
    "operation": null,
    "operation_author": null,
    "techResources": "",
    "email": null,
    "organization": "",
    "duration": null,
    "highlight": false,
    "exclusive": false,
    "embed": null,
    "link": null,
    "author": "",
    "approved": 0,
    "approvedScientific": 1,
    "approvedLinguistic": 0,
    "status": true,
    "accepted_terms": false,
    "created_at": "2019-06-05T11:26:39.000Z",
    "updated_at": "2019-02-25T13:29:01.000Z",
    "deleted_at": null,
    "user_id": 5,
    "type_id": 3,
    "image_id": null,
    "Thumbnail": null,
    "Terms": [
      {
        "id": 33,
        "title": "Android",
        "slug": "android",
        "icon": "android",
        "color": null,
        "type": null,
        "created_at": "2019-02-04T10:37:26.000Z",
        "updated_at": "2019-02-04T10:37:26.000Z",
        "deleted_at": null,
        "taxonomy_id": 3,
        "image_id": null,
        "parent_id": null,
        "resource_term": {
          "metadata": "https://play.google.com/store/apps/details?id=coocent.app.tools.soundmeter.noisedetector",
          "created_at": "2019-02-04T15:09:39.000Z",
          "updated_at": "2019-02-04T15:09:39.000Z",
          "resource_id": 1758,
          "term_id": 33
        }
      },
      {
        "id": 98,
        "title": "v3",
        "slug": "v3-version",
        "icon": null,
        "color": null,
        "type": null,
        "created_at": "2019-02-04T10:37:26.000Z",
        "updated_at": "2019-02-04T10:37:26.000Z",
        "deleted_at": null,
        "taxonomy_id": 19,
        "image_id": null,
        "parent_id": null,
        "resource_term": {
          "metadata": null,
          "created_at": "2019-02-04T15:09:31.000Z",
          "updated_at": "2019-02-04T15:09:31.000Z",
          "resource_id": 1758,
          "term_id": 98
        }
      }
    ],
    "User": {
      "name": "REDA",
      "organization": "REDA",
      "email": "reda_user@edu.azores.gov.pt"
    },
    "Type": {
      "id": 3,
      "title": "Aplicações",
      "slug": "APPS",
      "created_at": "2019-02-04T10:37:24.000Z",
      "updated_at": "2019-02-04T10:37:24.000Z",
      "deleted_at": null
    },
    "Taxonomies": [
      {
        "id": 4,
        "title": "Etiquetas",
        "slug": "tags_apps",
        "locked": true,
        "created_at": "2019-02-04T10:37:24.000Z",
        "updated_at": "2019-02-04T10:37:24.000Z",
        "type_id": 3,
        "Terms": [
          {
            "id": 1710,
            "title": "Física",
            "slug": null,
            "icon": null,
            "color": null,
            "image_id": null,
            "parent_id": null,
            "Image": null,
            "metadata": null
          }
        ]
      },
      {
        "id": 3,
        "title": "Sistemas",
        "slug": "sistemas_apps",
        "locked": true,
        "created_at": "2019-02-04T10:37:24.000Z",
        "updated_at": "2019-02-04T10:37:24.000Z",
        "type_id": 3,
        "Terms": [
          {
            "id": 33,
            "title": "Android",
            "slug": "android",
            "icon": "android",
            "color": null,
            "image_id": null,
            "parent_id": null,
            "Image": null,
            "metadata": "https://play.google.com/store/apps/details?id=coocent.app.tools.soundmeter.noisedetector"
          }
        ]
      },
      {
        "id": 2,
        "title": "Temas",
        "slug": "temas_apps",
        "locked": true,
        "created_at": "2019-02-04T10:37:24.000Z",
        "updated_at": "2019-02-04T10:37:24.000Z",
        "type_id": 3,
        "Terms": [
          {
            "id": 5228,
            "title": "Física",
            "slug": "fisica-7",
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