This is the specification to undo a tool availability action

### Request

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/tools/approved/:id/undo`

### Headers

* **redauid** &lt;string&gt;  
   Access token to update

### Arguments

Routing parameter

* **:id** &lt;int&gt;  
   Tool id to update


JSON Body

* **data** &lt;obj&gt;  
   Previous data in order to recover from action. Should have the following structure:
```
{
   "data": {
      "approvedScientific": <int>,
      "approvedLinguistic": <int>,
      "approved": <int>,
      "status": <int>
   } 
}
```
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
      "User": {
         "id": 3,
         "email": "reda_user@azores.gov.pt"
      }
   },
}
```