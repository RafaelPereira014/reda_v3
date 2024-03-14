This is the specification to create or update a term.

### Request

Use the **POST** method in the following URL to create:  
`https://reda-sta.azores.gov.pt/api/terms/`

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/terms/:slug`

### Headers

* **redauid** &lt;string&gt;   
   Access token to insert new data

### Arguments

If it is an update, must provide the routing parameter:

* **:slug** &lt;string&gt;  
   Term slug reference to update

JSON Body:  

* **title** &lt;string&gt;  
   Term title
* **color** - optional &lt;string&gt;  
   Term color for specific situations
* **icon** - optional &lt;string&gt;  
   Icon class based on [Font Awesome](https://fontawesome.com/icon)
* **image** &lt;obj&gt;  
   Image object with `data`, `size` and `extension` properties.  
   You can also add the `id` property to avoid create a new image that already exists.
* **parent** - optional &lt;int&gt;  
   Parent ID if is hierarchical  
* **tax** &lt;int&gt;  
   Tax ID to associate the term. **Use only to CREATE the term**  

#### Example request body
```
{
   "title": "Foo",
	"color": "#fff",
	"icon": "chevron-right",
	"parent": 35,
	"tax": 16
}
```

### Response Dependencies

Must be an administrator.

### Example Response

```
{
  "result": {
      "id": 6738,
      "title": "Foo",
      "slug": "foo",
      "parent_id": 35,
      "color": "#fff",
      "icon": "chevron-right",
      "taxonomy_id": 16,
      "updated_at": "2019-06-18T11:37:33.502Z",
      "created_at": "2019-06-18T11:37:33.502Z"
   }
}
```