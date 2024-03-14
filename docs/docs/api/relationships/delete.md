This is the specification for deleting a relationship.

### Request

Use the **DELETE** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/apps/:relationshipID`

### Headers

* **redauid** &lt;string&gt;  
   Access token to have delete permissions

### Arguments

Routing parameter:

* **:relationshipID** &lt;string&gt;  
   Relationship ID to delete

### Response Dependencies

Must be an administrator.

### Example Response

```
{
  "result": {}
}
```