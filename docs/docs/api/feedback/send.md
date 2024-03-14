This is the specification for sending feedback information from a form submition.

### Request

Use the **POST** method in the following URL:  
`https://reda-sta.azores.gov.pt/api/feedback`

### Arguments

JSON Body:  

* **subject** &lt;string&gt;  
   Subject string to identify the type of information that the body is related with
* **message** &lt;string&gt;  
   Message to send the administrators
* **name** &lt;string&gt;  
   Person name that is filling the form
* **email** - optional &lt;string&gt;  
   Email being used to send the feedback
* **recaptcha** &lt;string&gt;  
   Google reCAPTCHA token in order to avoid SPAM. This token will be validated with the Google API.

### Example Response

```
{
  "result": "Enviado"
}
```