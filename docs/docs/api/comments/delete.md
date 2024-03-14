This is the specification for deleting an application or list of applications.

### Request

Use the **DELETE** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/comments/:commentID`

### Headers

* **redauid** &lt;string&gt;  
   Access token to have delete permissions

### Arguments

Routing parameter:

* **:commentID** &lt;int&gt;  
   Comment ID to delete

### Response Dependencies

Must be the comment owner or an administrator.

### Example Response

```
{
  "result": {}
}
```