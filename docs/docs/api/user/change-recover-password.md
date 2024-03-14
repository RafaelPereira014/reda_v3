This is the specification for the user password change after requesting a recover.

### Request

Use the **POST** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/users/change-recover-password`

### Headers

* **redauid** &lt;string&gt;  
   Access token to get current user data

### Arguments

JSON Body:

* **token** &lt;string&gt;  
   Recover token provided with the sent e-mail in order to confirm the password change
* **password** &lt;string&gt;  
   The new password
* **confirmPassword** &lt;string&gt;  
   New password confirmation

### Example Response

```
{
	"result": "Palavra-passe foi modificada com sucesso"
}
```