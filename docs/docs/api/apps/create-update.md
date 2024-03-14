This is the specification to create or update an application.

### Request

Use the **POST** method in the following URL to create:  
`https://reda-sta.azores.gov.pt/api/apps/`

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/apps/:slug`

### Headers

* **redauid** &lt;string&gt;   
   Access token to insert new data

### Arguments

If it is an update, must provide the routing parameter:

* **:slug** &lt;string&gt;  
   App slug reference to update

JSON Body:  

* **title** &lt;string&gt;  
   App title
* **description** &lt;string&gt;  
   App description
* **links** &lt;array&gt;  
   Array of objects with a `link` and `id` properties that represent the system ID and the link to associate
* **image** &lt;obj&gt;  
   Image object with `data`, `size` and `extension` properties.  
   You can also add the `id` property to avoid create a new image that already exists.
* **terms** &lt;array&gt;  
   Array of terms IDs 
* **tags** &lt;array&gt;  
   Array of tags
* **accept_terms** &lt;bool&gt;  
   To check the terms were accepted

#### Example request body
```
{
   "id": 1,
   "title": "Foo Bar",
   "description": "Foo Bar",
   "links": [
      {
         "id": 1,
         "link": "www.google.com"
      }
   ],
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
   "image": [
      "id": null,
      "name": "foo bar file",
      "extension": "jpg",
      "data": <base64>,
      "size": 25261
   ]
   "accept_terms": true
}
```

### Response Dependencies

Must be the application owner or an administrator.

### Example Response

```
{
  "result": {
    "id": 110,
    "title": "Learn Physics",
    "slug": "learn-physics",
    "description": "É uma aplicação que ajuda a compreender determinados fenómenos da Física, de forma fácil e rápida. Possui vários tutoriais, uma calculadora, formulários e problemas para praticar. Gratuito e em inglês.\n",
    "user_id": 5,
    "Image": {
      "id": 1,
      "name": "imagem-1",
      "extension": "jpg",
      "status": true,
      "created_at": "2019-04-04T14:26:42.000Z",
      "updated_at": "2019-04-04T14:26:42.000Z",
      "deleted_at": null
   }
  }
}
```