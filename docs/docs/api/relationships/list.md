This is the specification for returning a list of relationships between terms. Will return the relationships identified with its level in the object keys as `term_slug_order_<orderNum>`.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/relationships`

### Arguments

Query string

* **limit** - optional &lt;int&gt;  
   Limit the list items (default: 9)
* **activePage** - optional &lt;int&gt;  
   Inform active page for pagination (default: 1)  
* **levels** - optional &lt;int&gt;  
  Set total of levels to get (default: 4)  
* **terms** - optional &lt;array&gt;  
  Provide an array of terms to filter the relationships from  

### Example Response

```
{
  "page": 1,
  "totalPages": 130,
  "limit": 9,
  "count": 9,
  "total": 1165,
  "result": [
    {
        "id": 6225,
        "term_slug_order_1": "artes-4",
        "term_id_1": "6498",
        "term_slug_order_2": "1",
        "term_id_2": "5243",
        "term_slug_order_3": "educaco-artistica",
        "term_id_3": "6499",
        "term_slug_order_4": "apropriaco-e-reflexo",
        "term_id_4": "243"
    }
  ]
}
```