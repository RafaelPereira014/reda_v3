This is the specification for request a password recovery. It will send an e-mail to the given e-mail in order to provide the new password.

### Request

Use the **POST** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/users/request-recover`

### Headers

* **redauid** &lt;string&gt;  
   Access token to get current user data

### Arguments

JSON Body:

* **email** &lt;string&gt;  
   E-mail to recover from.

### Example Response

```
{
	"result": "done"
}
```