This is the specification to create or update a relationship.

### Request

Use the **POST** method in the following URL to create:  
`https://reda-sta.azores.gov.pt/api/relationships/`

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/relationships/:relationshipID`

### Headers

* **redauid** &lt;string&gt;   
   Access token to insert new data

### Arguments

If it is an update, must provide the routing parameter:

* **:relationshipID** &lt;int&gt;  
   Relationship ID reference to update

JSON Body:  

* **terms** &lt;array&gt;  
   Array of terms to add to the relationship  

#### Example request body
```
{
	"terms": [
		{
			"term_id": 5269,
			"level": 1
		}
	]
}
```

### Response Dependencies

Must be an administrator.

### Example Response

```
{
  "result": {
      "id": 7391,
      "updated_at": "2019-06-18T15:21:28.086Z",
      "created_at": "2019-06-18T15:21:28.086Z"
   },
   "terms": [
      {
         "term_id": 5269,
         "level": 1
      }
   ],
   "create": true,
}
```