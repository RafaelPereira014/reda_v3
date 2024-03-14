This is the specification to create or update a list of scripts from a resource.

### Request

Use the **POST** method in the following URL to create or update:  
`https://reda-sta.azores.gov.pt/api/scripts/:resourceId`

### Headers

* **redauid** &lt;string&gt;  
   Access token to insert new data

### Arguments

If it is an update, must provide the routing parameter:

* **:resourceId** &lt;int&gt;  
   Resource id reference to update the scripts

JSON Body - Array of scripts with:  

* **id** - optional &lt;int&gt;  
   Script ID if there is any, in order to update instead of create
* **op_proposal** &lt;string&gt;  
   Operation Propostal/Script text
* **terms** &lt;array&gt;  
   Array of terms IDs
* **tags** &lt;array&gt;   
   Array of tags IDs  
* **targets** &lt;array&gt;   
   Array of targets IDs
* **file** &lt;obj&gt;  
   File object with `data`, `size` and `extension` properties.  
   You can also add the `id` property to avoid create a new image that already exists.

With the array of scripts:  

* **accept_terms** &lt;bool&gt;  
   To check the terms were accepted

#### Example request body
```
{
   "scripts": [
      {
         "id": 1, // In order to update. If it is to create, just don't provide an ID
         "op_proposal": "Foo Bar",
         "targets": [
            1,
            20,
            23
         ],
         "terms": [
            1,
            2,
            5,
            10
         ]
         "file": [
            "id": null,
            "name": "foo bar file",
            "extension": "png",
            "data": <base64>,
            "size": 25261
         ]
      }
   ],
   "accept_terms": true
}
```

### Response Dependencies

Must be the scripts owner or an administrator.

### Example Response

```
// 200 Status Response
{
  "message": "Propostas foram criadas/atualizadas"
}
```