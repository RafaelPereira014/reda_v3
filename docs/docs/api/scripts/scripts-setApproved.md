This is the specification to set a script availability

### Request

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/scripts/approved/:id`

### Headers

* **redauid** &lt;string&gt;  
   Access token to update

### Arguments

Routing parameter

* **:id** &lt;int&gt;  
   Script id to update


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
      "id": 7,
      "title": null,
      "description": null,
      "operation": "Em \"A representação dos números usando notação científica\", utilize a opção \"Recordar\"  para aceder a uma simulação que permite escrever um número racional positivo em notação científica. Repare que há uma secção para recordar potências de 10.",
      "approved": 1,
      "approvedScientific": 1,
      "approvedLinguistic": 1,
      "status": true,
      "main": false,
      "accepted_terms": false,
      "created_at": "2016-07-19T16:23:09.000Z",
      "updated_at": "2016-09-26T11:43:46.000Z",
      "deleted_at": null,
      "resource_id": 12,
      "user_id": 5,
      "User": {
         "id": 5,
         "email": "reda_user@edu.azores.gov.pt"
      },
      "Resource": {
         "id": 12,
         "title": "Quero... aprender notação científica",
         "slug": "quero-aprender-notaco-cientifica"
      }
   }
}
```