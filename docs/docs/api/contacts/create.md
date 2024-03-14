This is the specification to create a contact message.

### Request

Use the **POST** method in the following URL to create:  
`https://reda-sta.azores.gov.pt/api/contacts/:resourceSlug`

### Headers

* **redauid** &lt;string&gt;  
   Access token to insert new data

### Arguments

* **:resourceSlug** &lt;string&gt;  
   Resource slug reference to create a contact message

JSON Body:  

* **message** &lt;string&gt;  
   Message to send to the resource owner if you are not the owner. Else, the message will be sent to all administrators.  

### Example Response

```
{
  "result": {
      "id": 143,
      "description": "Hello",
      "user_id": 3,
      "resource_id": 1544,
      "status": "NEW",
      "updated_at": "2019-06-17T17:46:44.597Z",
      "created_at": "2019-06-17T17:46:44.597Z"
   }
}
```