var express = require('express');
var app = express()
var bodyParser = require('body-parser')
var GenerateSchema = require('generate-schema')
var Validator = require('jsonschema').Validator;


app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))

app.use(bodyParser.json())

app.get('/', function(request, response) {
  response.send('Hello World!')
})

app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})


var sch =
{"$schema":"http://json-schema.org/draft-04/schema#",
"title":"Product",
   "type":"object",
     "properties":{
         "payload":
             {"type":"array",
                "items":{"type":"object",
                   "properties":{
					   "address":{"type":"object",
					        "properties":
							      {"buildingNumber":{"type":"string"},
								   "lat":{"type":"number"},
								    "lon":{"type":"number"},
									  "postcode":{"type":"string"},
									     "state":{"type":"string"},
										    "street":{"type":"string"},
											   "suburb":{"type":"string"},
											      "unitNumber":{"type":"string"}}, 
                                                     "additionalProperties": false },
													   "propertyTypeId":{"type":"number"},
													   "readyState":{"type":"string"},
													   "reference":{"type":"string"},
													   "shortId":{"type":"string"},
													   "status":{"type":"number"},
													   "type":{"type":"string"},
													   "workflow":{"type":"string"},
													   "valfirm":{"type":"null"}},
													   "required":["address","propertyTypeId","readyState","reference","shortId","status","type","workflow"]}  }},
													   "additionalProperties": false}

app.post('/', function(req, res) {
	
  	if (!req.is('json')) {
		res.jsonp(400, {
			error : 'Invalid Request payload Type. Only JSON is accepted. Please check Content-Type header'
		});
		
		
	}
	
	 var v = new Validator();
	var results = v.validate(req.body, sch);
	if(results){
	 res.jsonp(400, {error : "Could not decode request: JSON parsing failed"});
          return;	
	}
	var payload = req.body.payload;

	var results = payload.filter(function (e){
	
	return e.workflow == "completed"
})


var finalresutls = results.map(function (e){
	var temp = e.address.buildingNumber+" "+e.address.suburb+" "+e.address.state+" "+e.address.postcode;
	var type = e.type;
	var flow = e.workflow;
	return  {"concataddress":temp,"type":type,"workflow":flow}
})

	  // console.log("Request "+finalresutls);
	     res.send({"response":[finalresutls]})


})


