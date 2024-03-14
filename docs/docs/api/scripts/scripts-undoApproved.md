This is the specification to undo a script availability action

### Request

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/scripts/approved/:id/undo`

### Headers

* **redauid** &lt;string&gt;  
   Access token to update

### Arguments

Routing parameter

* **:id** &lt;int&gt;  
   Script id to update


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
      "id": 7,
      "title": null,
      "description": null,
      "operation": "Em \"A representação dos números usando notação científica\", utilize a opção \"Recordar\"  para aceder a uma simulação que permite escrever um número racional positivo em notação científica. Repare que há uma secção para recordar potências de 10.",
      "approved": 0,
      "approvedScientific": 0,
      "approvedLinguistic": 0,
      "status": true,
      "main": false,
      "accepted_terms": false,
      "created_at": "2016-07-19T16:23:09.000Z",
      "updated_at": "2019-06-14T15:01:33.044Z",
      "deleted_at": null,
      "resource_id": 12,
      "user_id": 5,
      "User": {
         "id": 5,
         "email": "reda_user@edu.azores.gov.pt"
      }
   },
}
```