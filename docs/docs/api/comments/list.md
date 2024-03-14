This is the specification for returning a list of comments of a specific resource.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/comments/:resourceSlug`

### Headers

* **redauid** &lt;string&gt;  
   Access token to access data

### Arguments

Routing parameter:

* **:resourceSlug** &lt;int&gt;  
   Resource slug to retrieve the comments

Query string

* **limit** - optional  &lt;int&gt;  
   Limit the list items (default: 9)
* **activePage** - optional  &lt;int&gt;  
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
      "id": 9,
      "text": "A ligação não está disponível para consulta e aparece a seguinte mensagem:\n\n\"Service Temporarily Unavailable\nThe server is temporarily unable to service your request due to maintenance downtime or capacity problems. Please try again later.\nWeb Server at ncultura.pt\"",
      "user_id": 148,
      "created_at": "2017-04-27T15:18:48.000Z",
      "approved": 1,
      "status": true,
      "level": 0,
      "User": {
        "id": 148,
        "organization": "Escola Básica e Secundária Tomás de Borba",
        "image_id": null,
        "hidden": false,
        "name": "Manuel Alberto Cordeiro e Costa",
        "Image": null
      },
      "parentComment": [
        {
          "id": 1,
          "created_at": "2017-05-25T11:21:17.000Z",
          "updated_at": "2017-05-25T11:21:17.000Z",
          "deleted_at": null,
          "parent_id": 9,
          "child_id": 11,
          "childComment": {
            "id": 11,
            "text": "Caro Manuel, obrigado pela chamada de atenção. O recurso está disponível online. Talvez o computador de onde tentou aceder não tivesse instalados todos os requisitos técnicos necessários para a sua visualização.",
            "approved": 1,
            "status": true,
            "level": 1,
            "created_at": "2017-05-25T11:21:17.000Z",
            "updated_at": "2017-05-25T11:21:17.000Z",
            "deleted_at": null,
            "user_id": 5,
            "resource_id": 148,
            "User": {
              "id": 5,
              "organization": "REDA",
              "image_id": null,
              "hidden": false,
              "name": "REDA",
              "Image": null
            }
          }
        }
      ]
    }
  ]
}
```