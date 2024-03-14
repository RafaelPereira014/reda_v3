This is the specification for deleting a script.

### Request

Use the **DELETE** method in the following URL for a list of scripts:  
`https://reda-sta.azores.gov.pt/api/scripts/`

Use the **DELETE** method in the following URL for a single script:  
`https://reda-sta.azores.gov.pt/api/scripts/:scriptId`


### Headers

* **redauid** &lt;string&gt;  
   Access token to get full information

### Arguments

If it is a single script, must provide the routing parameter:

* **:scriptId** &lt;int&gt;  
   Script Id to delete

If is list of scripts (JSON Body):

* **scripts** &lt;array&gt;  
   Array of scripts IDs to delete

### Response Dependencies

Must be the scripts owner or an administrator.

### Example Response

```
{
  "result": {}
}
```