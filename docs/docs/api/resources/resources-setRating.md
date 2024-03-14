This is the specification to set a resource rating

### Request

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/resources/rating/:id`

### Headers

* **redauid** &lt;string&gt;  
   Access token to update

### Arguments

Routing parameter

* **:id** &lt;int&gt;  
   Resource id to update


JSON Body

* **value** &lt;int&gt;  
   Rating value

### Example Response

```
{
  "result": {
    "status": true,
    "id": 9,
    "value": 3,
    "resource_id": "8",
    "user_id": 3,
    "updated_at": "2016-08-31T16:36:28.000Z",
    "created_at": "2016-08-31T16:36:28.000Z"
  }
}
```