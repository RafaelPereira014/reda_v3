This is the specification for returning a list of tools, based on search parameters.

### Request

Use the **GET** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/tools/search`

### Arguments

Query string

* **limit** - optional &lt;int&gt;  
   Limit the list items (default: 9)
* **activePage** - optional &lt;int&gt;  
   Inform active page for pagination (default: 1)
* **terms** - optional &lt;array&gt;  
   Array of terms IDs for filtering
* **tags** - optional &lt;array&gt;  
   Array of tags text for filtering  
* **approval** - optional &lt;string&gt;    
   *null* - Resources that are already approved  
   *scientific* - Get resources that are depending of scientific validation  
   *linguistic* - Get resources that are depending of linguistic validation
* **type** - optional &lt;string&gt;    
   *null* - All tools in default scope  
   *mytools* - tools that the user owns  
   *pending* - tools awaiting for approval  
* **order** - optional &lt;string&gt;   
   *recent* - Most recent (DESC)

### Response Dependencies

If there is no given token, some information will not be available, such as:

* List of tools that the user owns
* Tools awaiting for approval

### Example Response

```
{
  "page": 1,
  "totalPages": 9,
  "limit": 9,
  "count": 9,
  "total": 79,
  "result": [
    {
      "id": 80,
      "slug": "gravar-ficheiros-doc-ou-docx-em-pdf",
      "title": "Gravar ficheiros .doc ou .docx em .pdf ",
      "description": "Com o ficheiro aberto, escolher o separador \"Ficheiro\", selecionar a opção \"Gravar como\" e, de seguida, a pasta de ficheiros onde pretende guardar o novo documento em PDF. Em \"Guardar com o tipo\", escolher a opção \"PDF\" e, por fim, guardar.\n",
      "link": null,
      "created_at": "2016-07-20T21:26:16.000Z"
    }
  ]
}
```