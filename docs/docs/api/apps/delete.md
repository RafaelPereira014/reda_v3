This is the specification for deleting an application or list of applications.

### Request

Use the **DELETE** method in the following URL for a list of applications:  
`https://reda-sta.azores.gov.pt/api/apps/`

Use the **DELETE** method in the following URL for a single application:  
`https://reda-sta.azores.gov.pt/api/apps/:slug`

### Headers

* **redauid** &lt;string&gt;  
   Access token to have delete permissions

### Arguments

If it is a single application, must provide the routing parameter:

* **:slug** &lt;string&gt;  
   Application slug to delete

If is list of applications (JSON Body):

* **apps** &lt;array&gt;  
   Array of application IDs to delete

### Response Dependencies

Must be the application owner or an administrator.

### Example Response

```
{
  "result": {}
}
```