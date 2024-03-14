This is the specification for returning a list of pending comments.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/comments/pending`

### Headers

* **redauid** &lt;string&gt;  
   Access token to access data

### Arguments

Query string

* **limit** - optional &lt;int&gt;  
   Limit the list items (default: 9)
* **activePage** - optional &lt;int&gt;  
   Inform active page for pagination (default: 1)
* **order** - optional &lt;int&gt;    
   **recent** - Most recent (DESC)

### Response Dependencies

Must be an admin to access this information.

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
      "User": {
        "id": 1,
        "name": "REDA",
        "organization": "REDA",
        "hidden": false
      },
      "Resource": {
        "id": 8,
        "title": "este é o 7",
        "slug": "este-e-o-7"
      }
    }
  ]
}
```