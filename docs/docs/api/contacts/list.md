This is the specification for returning a list of contacts made by the authenticated user. If is admin, will show all contacts.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/contacts/user`

### Headers

* **redauid** &lt;string&gt;  
   Access token to insert new data

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
  "totalPages": 8,
  "limit": 9,
  "count": 9,
  "total": 64,
  "result": [
    {
      "id": 1544,
      "title": "Célébrités francophones",
      "slug": "celebrites-francophones",
      "created_at": "2018-12-03T00:13:15.000Z",
      "updated_at": "2019-04-03T16:43:04.000Z",
      "isNew": 0,
      "didInteract": 1,
      "Contacts": [
        {
          "id": 142,
          "description": "Hello\n\nEste é um belo teste",
          "status": "NEW",
          "created_at": "2019-03-15T17:55:40.000Z",
          "updated_at": "2019-03-15T17:55:40.000Z",
          "deleted_at": null,
          "resource_id": 1544,
          "user_id": 3,
          "User": {
            "id": 3,
            "name": "REDA",
            "organization": "REDA"
          }
        },
        {
          "id": 137,
          "description": "asd",
          "status": "READ",
          "created_at": "2019-02-18T12:34:46.000Z",
          "updated_at": "2019-03-15T17:20:13.000Z",
          "deleted_at": null,
          "resource_id": 1544,
          "user_id": 1507,
          "User": {
            "id": 1507,
            "name": "Marisa Teixeira",
            "organization": "Escola Secundária Jerónimo Emiliano de Andrade"
          }
        },
        {
          "id": 136,
          "description": "asd",
          "status": "NEW",
          "created_at": "2019-02-18T12:32:45.000Z",
          "updated_at": "2019-02-18T12:32:45.000Z",
          "deleted_at": null,
          "resource_id": 1544,
          "user_id": 3,
          "User": {
            "id": 3,
            "name": "REDA",
            "organization": "REDA"
          }
        },
        {
          "id": 135,
          "description": "asd",
          "status": "NEW",
          "created_at": "2019-02-18T12:30:49.000Z",
          "updated_at": "2019-02-18T12:30:49.000Z",
          "deleted_at": null,
          "resource_id": 1544,
          "user_id": 3,
          "User": {
            "id": 3,
            "name": "REDA",
            "organization": "REDA"
          }
        },
        {
          "id": 118,
          "description": "Cara utilizadora, em primeiro lugar queremos agradecer o seu contributo na partilha de recursos na plataforma REDA. \nVimos, por este meio, solicitar-lhe a correção dos seguintes itens no seu Kahoot “Célébrités Francophones” de forma a podermos validar o seu recurso:\n- retirar o “s” em “célèbres” na frase “Charles Perrault est un homme de lettres français célèbres pour ses…” ;\n- colocar “Le Petit Prince” entre aspas ou a itálico;\n- retirar o acento agudo em Louane Eméra;\n- colocar um acento grave em “célèbre” na frase “Le plus célebre festival de cinéma”;\n- na questão “Avec le film Intouchables, Omar Sy a gagné… ”, a resposta correta não é “le César de meilleur acteur 2012” em vez de “une Victoire de la musique” ?\nGrata pela atenção.\nA Equipa REDA",
          "status": "READ",
          "created_at": "2018-12-07T23:06:50.000Z",
          "updated_at": "2019-03-15T17:20:13.000Z",
          "deleted_at": null,
          "resource_id": 1544,
          "user_id": 1507,
          "User": {
            "id": 1507,
            "name": "Marisa Teixeira",
            "organization": "Escola Secundária Jerónimo Emiliano de Andrade"
          }
        },
        {
          "id": 117,
          "description": "Cara utilizadora, vimos por este meio agradecer a correção do recurso, no entanto detetámos mais duas situações: é possível corrigir a palavra \"synonime\" em \"Le mot 'Métier' est...\", opção \"un synonyme de travailleur\". Aproveitamos para perguntar se, na primeira imagem/apresentação sobre a profissão de 'coiffeur', pretende que o retângulo a vermelho com a resposta 'médecin' esteja sempre a surgir, ao contrário das restantes perguntas, apesar de não ser a resposta correta.\nPor fim, um pequeno pormenor: na resposta \"Le féminin du mot 'Pharmacien' est. Pharmacienne!\" tem um ponto final a seguir à forma verbal do verbo être.\nGrata pela compreensão.\nA Equipa REDA",
          "status": "NEW",
          "created_at": "2018-12-07T22:12:10.000Z",
          "updated_at": "2019-02-18T12:16:20.000Z",
          "deleted_at": null,
          "resource_id": 1544,
          "user_id": 3,
          "User": {
            "id": 3,
            "name": "REDA",
            "organization": "REDA"
          }
        }
      ],
      "Type": {
        "id": 2,
        "title": "Recursos",
        "slug": "RESOURCES",
        "created_at": "2019-02-04T10:37:24.000Z",
        "updated_at": "2019-02-04T10:37:24.000Z",
        "deleted_at": null
      }
    }
  ]
}
```