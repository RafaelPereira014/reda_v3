This is the specification for deleting a news.

### Request

Use the **DELETE** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/news/:slug`

### Headers

* **redauid** &lt;string&gt;  
   Access token to have delete permissions

### Arguments

Routing parameter:

* **:slug** &lt;string&gt;  
   News slug to delete

### Response Dependencies

Must be an administrator.

### Example Response

```
{
  "result": {}
}
```