This is the specification for sign up a new user.

### Request

Use the **POST** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/users/signup`

### Arguments

JSON Body:

* **email** &lt;string&gt;  
   User email
* **password** &lt;string&gt;  
   User password
* **name** &lt;string&gt;  
   User name
* **organization** &lt;string&gt;  
   User organization/school
* **type** &lt;string&gt;  
   User type slug, based on role
* **acceptance** &lt;bool&gt;  
   Informs if user accepted the terms and conditions

### Example Response

```
{
  "token": "<randomTokenString>"
}
```