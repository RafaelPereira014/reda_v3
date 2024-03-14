This is the specification for deleting a resource or list of resources.

### Request

Use the **DELETE** method in the following URL for a list of resources:  
`https://reda-sta.azores.gov.pt/api/resources/`

Use the **DELETE** method in the following URL for a single resource:  
`https://reda-sta.azores.gov.pt/api/resources/:slug`

### Headers

* **redauid** &lt;string&gt;  
   Access token to have delete permissions

### Arguments

If it is a single resource, must provide the routing parameter:

* **:slug** &lt;string&gt;  
   Resource slug to delete

If is list of resources (JSON Body):

* **resources** &lt;array&gt;  
   Array of resources IDs to delete

### Response Dependencies

Must be the resources owner or an administrator.

### Example Response

```
{
  "result": {}
}
```