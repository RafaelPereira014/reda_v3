This is the specification to undo an application availability action

### Request

Use the **PUT** method in the following URL to update:  
`https://reda-sta.azores.gov.pt/api/apps/approved/:id/undo`

### Headers

* **redauid** &lt;string&gt;  
   Access token to update

### Arguments

Routing parameter

* **:id** &lt;int&gt;  
   App id to update


JSON Body

* **data** &lt;obj&gt;  
   Previous data in order to recover from action. Should have the following structure:
```
{
   "data": {
      "approvedScientific": <int>,
      "approvedLinguistic": <int>,
      "approved": <int>,
      "status": <int>
   } 
}
```
### Example Response

```
{
  "result": {
      "id": 1689,
      "title": "GeoGebra Calculadora Gráfica",
      "slug": "geogebra-calculadora-grafica",
      "description": "Aplicação com calculadora gráfica para a geometria, álgebra, cálculo e estatística. Permite, entre outras funcionalidades, desenhar à mão livre com o reconhecimento de formas, construções geométricas dinâmicas, apresentar gráficos de funções e formas side-by-side. In-app busca de milhares de materiais de aprendizagem gratuitos, criados e partilhados por alunos e professores de todo o mundo. Ajuda disponível em www.geogebra.org.\n",
      "operation": null,
      "operation_author": null,
      "techResources": "",
      "email": null,
      "organization": "",
      "duration": null,
      "highlight": false,
      "exclusive": false,
      "embed": null,
      "link": null,
      "author": "",
      "approved": 0,
      "approvedScientific": 0,
      "approvedLinguistic": 0,
      "status": true,
      "accepted_terms": true,
      "created_at": "2019-03-04T10:37:26.000Z",
      "updated_at": "2019-06-14T16:36:02.525Z",
      "deleted_at": null,
      "user_id": 3,
      "type_id": 3,
      "image_id": 153,
      "User": {
         "id": 3,
         "email": "reda_user@azores.gov.pt"
      }
   },
}
```