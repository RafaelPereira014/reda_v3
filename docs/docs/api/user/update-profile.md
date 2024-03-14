This is the specification for the user profile update.

### Request

Use the **PUT** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/users/profile/:userId`

### Headers

* **redauid** &lt;string&gt;  
   Access token to insert new data

### Arguments

Routing parameter:

* **:userId** &lt;int&gt;  
   The user Id to update

JSON Body:  

* **password** - optional &lt;string&gt;  
   New password
* **organization** &lt;string&gt;  
   Organization that the user belongs to
* **hidden** &lt;int&gt;  
   Sets if the user will have its name hidden in its publications.

### Response Dependencies

If no token provided, it is not possible to update a user.

### Example Response

```
// 200 Status Response
{
   "id":3,
   "hidden":true,
   "email":"foo@foo.com",
   "role":"user",
   "name":"Foo Bar",
   "image":null,
   "organization":"FOO"
}
```