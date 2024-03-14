This is the specification for returning a list of validation errors. This allows to make an async validation while filling information in the resources form.

### Request

Use the **POST** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/resources/async-validate`

### Headers

* **redauid** &lt;string&gt;   
   Access token to inspect data

### Arguments

JSON Body

* **fields** &lt;array&gt;  
  Array of key-value pair field objects. Ex: 

```
{
  "fields": [
    {
      "key": "title",
      "value": "Foo Bar"
    }
  ],
  "resource_slug": "foo-bar"
}
```
* **resource_slug**  &lt;string&gt;
  Slug of the resource. This avoids giving validation errors when editing the resource because it will avoid validation with itself

### Example Response

```
{
  "result": [
    {
      "field": "title",
      "error": "Já existe um recurso com esse título"
    }
  ],
}
```