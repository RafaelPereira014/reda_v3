This is the specification to set all resource contact messages as read.

### Request

Use the **PUT** method in the following URL to create:  
`https://reda-sta.azores.gov.pt/api/contacts/:resourceSlug/read`

### Headers

* **redauid** &lt;string&gt;  
   Access token to insert new data

### Arguments

* **:resourceSlug** &lt;string&gt;  
   Resource slug reference to set the message

### Example Response

```
{
  "result": {
     2   // Number of affected messages
  }
}
```