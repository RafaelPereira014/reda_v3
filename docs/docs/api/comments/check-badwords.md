This is the specification for returning a list of bad words if there are any in a comment.

### Request

Use the **POST** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/comments/has-badwords`

### Arguments

JSON Body

* **comment** &lt;string&gt;  
   Comment string to check for any bad words

### Example Response

```
{
  "result": [
    {
      "title": "Word"
    }
  ]
}
```