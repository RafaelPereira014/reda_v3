This is the specification to confirm a sign up process for a specific user.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/users/confirm/:token`

### Arguments

Routing parameter:

* **:token** &lt;string&gt;  
   Confirmation token sent to e-mail

### Example Response

```
{
  "result": "true"
}
```