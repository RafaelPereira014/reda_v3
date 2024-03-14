This is the specification for deleting a hint or list of tools.

### Request

Use the **DELETE** method in the following URL for a list of tools:  
`https://reda-sta.azores.gov.pt/api/tools/`

Use the **DELETE** method in the following URL for a single hint:  
`https://reda-sta.azores.gov.pt/api/tools/:slug`

### Headers

* **redauid** &lt;string&gt;  
   Access token to have delete permissions

### Arguments

If it is a single tool, must provide the routing parameter:

* **:slug** &lt;string&gt;  
   Tool slug to delete

If is list of tools (JSON Body):

* **tools** &lt;array&gt;  
   Array of tools IDs to delete

### Response Dependencies

Must be the tool owner or an administrator.

### Example Response

```
{
  "result": {}
}
```