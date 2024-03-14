This is the specification for sign in.

### Request

Use the **POST** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/users/signin`

### Arguments

JSON Body:

* **email** &lt;string&gt;   
   User email
* **password** &lt;string&gt;   
   User password

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