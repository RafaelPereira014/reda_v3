This is the specification to create or update a tool.

### Request

Use the **POST** method in the following URL to create:  
`https://reda-sta.azores.gov.pt/api/tools/`

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/tools/:slug`

### Headers

* **redauid** &lt;string&gt;    
   Access token to insert new data

### Arguments

If it is an update, must provide the routing parameter:

* **:slug** &lt;string&gt;    
   Tools slug reference to update

JSON Body:  

* **title** &lt;string&gt;    
   Tools title
* **description** &lt;string&gt;    
   Tools description
* **link** - optional &lt;string&gt;    
   Link URL
* **tags**  &lt;array&gt;    
   Array of tags text
* **terms** &lt;array&gt;  
   Array of terms IDs
* **accept_terms** &lt;bool&gt;  
   To check the terms were accepted

#### Example request body
```
{
   "id": 1,
   "title": "Foo Bar",
   "description": "Foo Bar",
   "link": "www.google.com"
   "tags": [
      "Foo",
      "Bar"
   ],
   "terms": [
      1,
      2,
      5,
      10
   ]
   "accept_terms": true
}
```

### Example Response

```
{
  "result": {
    "id": 110,
    "title": "Learn Physics",
    "description": "É uma aplicação que ajuda a compreender determinados fenómenos da Física, de forma fácil e rápida. Possui vários tutoriais, uma calculadora, formulários e problemas para praticar. Gratuito e em inglês.\n",
    "link": "www.google.com"
  }
}
```