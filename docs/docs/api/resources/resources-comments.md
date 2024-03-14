This is the specification for returning a list of comments from a resource.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/comments/:slug`

### Headers

* **redauid** - optional &lt;string&gt;  
   Access token to access data

### Arguments

Routing parameter:

* **:slug** &lt;string&gt;  
   Resource slug to get comments

Query string

* **limit** - optional &lt;int&gt;  
   Limit the list items (default: 9)
* **activePage** - optional &lt;int&gt;  
   Inform active page for pagination (default: 1)

### Response Dependencies

If a token is given, the comments list will also include those that are pending from approval.

### Example Response

```
{
  "page": 1,
  "totalPages": 2,
  "limit": 9,
  "count": 9,
  "total": 13,
  "result": [
    {
      "id": 27,
      "text": "Este é um exemplo",
      "user_id": 1,
      "created_at": "2016-07-21T16:31:34.000Z",
      "approved": 0,
      "status": true,
      "User": {
        "id": 1,
        "name": "Técnico da REDA",
        "organization": "REDA",
        "hidden": false,
        "Image": null
      }
    }
  ]
}
```