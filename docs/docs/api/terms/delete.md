This is the specification for deleting an application or list of terms.

### Request

Use the **DELETE** method in the following URL for a list of terms:  
`https://reda-sta.azores.gov.pt/api/terms/`

Use the **DELETE** method in the following URL for a single term:  
`https://reda-sta.azores.gov.pt/api/terms/:slug`

### Headers

* **redauid** &lt;string&gt;  
   Access token to have delete permissions

### Arguments

If it is a single term, must provide the routing parameter:

* **:slug** &lt;string&gt;  
   Term slug to delete

If is list of terms (JSON Body):

* **terms** &lt;array&gt;  
   Array of terms IDs to delete

### Response Dependencies

Must be an administrator.

### Example Response

```
{
  "result": {}
}
```