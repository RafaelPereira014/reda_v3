This is the specification to set a tool availability

### Request

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/tools/approved/:id`

### Headers

* *redauid* &lt;string&gt;  
   Access token to update

### Arguments

Routing parameter

* **:id** &lt;int&gt;  
   Tool id to update


JSON Body

* **status** &lt;bool&gt;  
   Set status (approved or not). Set this to `true` to progressively approve each stage.
* **messagesList** - optional &lt;array&gt;  
   List of messages to send the owner if not approved
* **message** - optional &lt;string&gt;  
   Message to send the owner if not approved and is custom message

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
      "updated_at": "2019-06-14T16:53:10.837Z",
      "deleted_at": null,
      "user_id": 3,
      "type_id": 1,
      "image_id": null,
      "User": {
         "id": 3,
         "email": "reda_user@azores.gov.pt"
      }
   },
}
```