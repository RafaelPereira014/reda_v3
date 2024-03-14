This is the specification to create a comment.

### Request

Use the **POST** method in the following URL to create:  
`https://reda-sta.azores.gov.pt/api/comments/:slug`

<!-- Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/comments/:slug` -->

### Headers

* **redauid** &lt;string&gt;  
   Access token to insert new data

### Arguments

* **:slug** &lt;string&gt;  
   Resource slug reference to create a comment

JSON Body:  

* **comment** &lt;string&gt;  
   Comment string
* **parent** - optional &lt;int&gt;  
   If it is a response to another comment, provide the parent comment ID

### Example Response

```
{
  "result": {
    "text": "This is a comment",
    "resource_id": 1,
    "user_id": 1,
    "approved": 1
  }
}
```