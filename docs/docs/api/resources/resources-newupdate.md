This is the specification to create a new resource or update.

### Request

Use the **POST** method in the following URL to create:  
`https://reda-sta.azores.gov.pt/api/resources/`

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/resources/:slug`

### Headers

* **redauid** &lt;string&gt;   
   Access token to insert new data

### Arguments

If it is an update, must provide the routing parameter:

* **:slug** &lt;string&gt;  
   Resource slug to update

Resource information (JSON Body):  

* **title** &lt;string&gt;  
   Resource Title
* **author** &lt;string&gt;  
   Resource Author
* **organization** &lt;string&gt;  
   Author organization
* **tags** &lt;array&gt;  
   Array of tags text or id
* **format** &lt;obj&gt;  
   Format object with ID property
* **isOnline** &lt;bool&gt;  
   Inform if this resource has a localization online
* **file** &lt;obj&gt;  
   File object with `data`, `size` and `extension` properties.  
   You can also add the `id` property to avoid create a new image that already exists.
* **thumbnail** &lt;obj&gt;
   Thumbnail object with `data`, `size` and `extension` properties.  
   You can also add the `id` property to avoid create a new image that already exists.  
* **link** &lt;string&gt;  
   Link to the resource. Not needed if there is an embed code
* **embed** &lt;string&gt;   
   Embed code of the resource. Not needed if there is a link
* **access** &lt;array&gt;  
   Array of access modes IDs
* **techResources** &lt;string&gt;  
   Text with the technical requirements
* **description** &lt;string&gt;  
   Resource description
* **language** &lt;obj&gt;  
   Language object with ID property
* **years** &lt;array&gt;  
   Array of years IDs for filtering
* **macro** &lt;array&gt;   
   Array of macro areas IDs 
* **subjects** &lt;array&gt;   
   Array of subjects IDs 
* **domains** &lt;array&gt;  
   Array of domains IDs 
* **op_proposal** &lt;string&gt;  
   Operation proposal description  
* **script_file** &lt;obj&gt;  
   File object with `data`, `size` and `extension` properties to append to the operation proposal.  
   You can also add the `id` property to avoid create a new image that already exists.  
* **accept_terms** &lt;bool&gt;  
   To check the terms were accepted

#### Example request body
```
{
   "exclusive": true,
   "access": [
      29712
   ],
   "isOnline": false,
   "isFile": true,
   "tags": [
      "foo",
      "bar"
   ],
   "title": "Teste",
   "author": "teste1",
   "organization": "teste",
   "format": {
      "id": 29708,
      "title": "Imagem",
      "slug": "image-1",
      "icon": null,
      "color": "#0066ff",
      "type": "image",
      "created_at": "2018-12-18T18:34:00.000Z",
      "updated_at": "2019-01-02T15:29:14.000Z",
      "deleted_at": null,
      "taxonomy_id": 10,
      "image_id": 4,
      "parent_id": null,
      "hasResources": 1,
      "Relationship": []
   },
   "duration": null,
   "file": {
      "id": null,
      "name": "audiovis",
      "extension": "png",
      "data": <base64>,
      "size": 25261
   },
    "techResources": "foobar",
    "description": "foobar",
    "language": {
      "id": 29697,
      "title": "Inglês",
      "slug": "ingles-1",
      "icon": null,
      "color": null,
      "type": null,
      "created_at": "2018-12-18T18:33:58.000Z",
      "updated_at": "2018-12-18T18:33:58.000Z",
      "deleted_at": null,
      "taxonomy_id": 11,
      "image_id": null,
      "parent_id": null,
      "hasResources": 1,
      "Relationship": []
    },
    "thumbnail": {
      "id": null,
      "name": "design_com",
      "extension": "png",
      "data": <base64>,
      "size": 76348 
    },
    "years": [
        5270
    ],
    "terms": [
        2,
        4,
        3,
        8,
        5270
    ],
    "subjects": [
        2
    ],
    "macro": [
        4
    ],
    "domains": [
        3,
        8
    ],
    "op_proposal": "foobarfoobar",
    "script_file": {
      "id": null,
      "name": "ciencias_socio1",
      "extension": "png",
      "data": <base64>,
      "size": 76348,
      "fullResult": <blob>
   },
   "accept_terms": true
}
```

### Response Dependencies

Must be the resource owner or an administrator.

### Example Response

```
{
  "result": [
    {
      "status": true,
      "id": 1766,
      "title": "Teste",
      "slug": "teste-13",
      "description": "foobar",
      "duration": null,
      "author": "teste1",
      "organization": "teste",
      "email": null,
      "highlight": false,
      "exclusive": true,
      "embed": null,
      "link": null,
      "techResources": "foobar",
      "user_id": 20,
      "approved": 0,
      "approvedScientific": 0,
      "approvedLinguistic": 0,
      "type_id": 2,
      "image_id": 162,
      "accepted_terms": true,
      "updated_at": "2019-06-13T16:23:57.846Z",
      "created_at": "2019-06-13T16:23:57.846Z"
    }
  ]
}
```