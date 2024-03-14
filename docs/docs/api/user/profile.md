This is the specification for fetching user profile information.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/users/profile`

### Headers

* **redauid** &lt;string&gt;   
   Access token to get current user data

### Example Response

```
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