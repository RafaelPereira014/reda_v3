This is the specification for returning a script details.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/scripts/single-script/:scriptID`

### Headers

* **redauid** &lt;string&gt;  
   Access token to get full information

### Arguments

Routing parameter

* **:scriptID** &lt;int&gt;  
   Script ID in order to get information

### Response Dependencies

* If there is no given token, no information will be returned.
* If user is not the owner and is not an admin, will have no access to the script.

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
    "Terms": [
      {
        "id": 11,
        "title": "8.º",
        "slug": "8-asdasd",
        "icon": null,
        "color": null,
        "type": null,
        "created_at": "2019-02-04T10:37:26.000Z",
        "updated_at": "2019-02-04T10:37:26.000Z",
        "deleted_at": null,
        "taxonomy_id": 5,
        "image_id": null,
        "parent_id": null
      },
    ],
    "Files": [],
    "User": {
      "id": 5
    },
    "Resource": {
      "id": 12,
      "title": "Quero... aprender notação científica",
      "slug": "quero-aprender-notaco-cientifica",
      "description": "Recurso multidisciplinar. Este recurso está divido em quatro partes que podem ser usadas em conjunto ou em separado: 1.ª A representação dos números, usando notação científica (embora esta secção esteja identificada como \"recordar\", também pode ser usada na introdução deste conteúdo); 2.ª Praticar a representação anterior; 3.ª  A comparação de dois números escritos em notação científica; 4.ª Praticar a comparação anterior. (Nas secções \"Praticar\", há um tempo limite de 30 segundos para a resolução de cada exercício, sendo possível verificar e corrigir os resultados.) ",
      "operation": "Recurso multidisciplinar\nConsulte as diferentes propostas de operacionalização.",
      "operation_author": null,
      "techResources": "Adobe Flash Player",
      "email": null,
      "organization": "Universidade do Minho e Universidade de Coimbra",
      "duration": null,
      "highlight": false,
      "exclusive": true,
      "embed": null,
      "link": "http://hypatiamat.com/quero/notacaoCientifica/queroNotacaoCientifica.php",
      "author": "Ricardo Pinto, Dina Loff, Ema Maia, Pedro Rosário e colaboradores",
      "approved": 1,
      "approvedScientific": 1,
      "approvedLinguistic": 1,
      "status": true,
      "accepted_terms": false,
      "created_at": "2016-07-19T16:22:13.000Z",
      "updated_at": "2016-11-03T12:31:41.000Z",
      "deleted_at": null,
      "user_id": 5,
      "type_id": 2,
      "image_id": null
    }
  }
}
```