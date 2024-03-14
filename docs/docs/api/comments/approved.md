This is the specification to set a comment as approved or not.

### Request

Use the **PUT** method in the following URL to create:  
`https://reda-sta.azores.gov.pt/api/comments/approved/:commentID`

### Headers

* *redauid* &lt;string&gt;  
   Access token to insert new data

### Arguments

* **:commentID** &lt;int&gt;  
   Comment ID to change status

JSON Body:  

* **status** &lt;bool&gt;  
   Comment status to set
* **message** - optional &lt;string&gt;  
   Message to send if comment is not approved

### Example Response

```
{
  "result": {
    "approved": 1,
    "status": true
  }
}
```