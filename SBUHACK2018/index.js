/*
 * index.js
 * Clarifai Basic Application demo code
 * You can reference Clarifai's JavaScript library to 
 * complete this demo available at 
 * https://github.com/Clarifai/clarifai-javascript
 */
(function ($, Clarifai) {
	$(document).ready(function () {
		initialize()
	})

	// Finding a bunch of elements in the DOM
	var app = $(".app")
	var imageInput = $("#imageUrl");
	var submitButton = $("#submitBtn");
	var image = $("#image");
	var tagsContainer = $(".tags-container");
	var tags = $(".tags")
	var appClarifai;
	var imageLocal = $("fileField");

	submitButton.on("click", function (event) {
		// getting the input from the image
		var url = imageInput.val()
		//resetInfo();
		/*if(url.length == 0){
			var canvas = document.createElement("canvas")
			var context = canvas.getContext('2d')
			
			canvas.width = imageLocal.value.width;
			canvas.height = imageLocal.value.height;
			
			url = canvas.toDataURL()
			alert(url);
		}*/ 
		
		tagsContainer.hide()

		// You can ignore this part
		// Set's the url of the image preview
		image.attr("src", url)


		/*
		 * TODO
		 * request Clarifai tag for the url by using Clarifai.getTagsByUrl{id:'SBU Hacks2018', version:'a2809388b23b4f3f829037fc376a79d4'}
		 */
	//	let appClarifai = new Clarifai.App({apiKey: '7fe98b11f3ef4db58d52e092c1349f8a'});
		appClarifai.models.predict({id:'SBU Hacks2018', version:'a2809388b23b4f3f829037fc376a79d4'}, url).then(
		function(response) {
		// do something with response
		console.log(response)
		var concept = response.outputs[0].data.concepts[0];
		var minProb = 0.49;
		var name = "";
		if(concept.value < minProb){
			appClarifai.models.predict(Clarifai.GENERAL_MODEL, url).then(
			function(response) {
				
				console.log(response.outputs[0].data.concepts[0].name);
				console.log(response.outputs[0].data.concepts[1].name);
				console.log(response.outputs[0].data.concepts[2].name);
				name = response.outputs[0].data.concepts[0].name.toString();
				if(name != "" && name != "no person")
					getWiki(name);
			},
			function(err) {
				console.log(err);
			}
			);
		} else{
			console.log(concept.name);
			name = concept.name;
		}
		
		if(name != "")
			getWiki(name);
			
		},
		function(err) {
		// there was an error
			window.alert(err);
			console.log(err);
		}
		);
		/*
		 * TODO
		 * request colors for the image by using Clarifai function to get *colors by url. 
		 */

	});
	
	function getWiki(name){
		var site = 'http://en.wikipedia.org/wiki/'+name;
			 WIKIPEDIA.getData(site, display, function(error) {
				alert(error);
				}
			);
	}
	
	var display = function(info) {

      rawData = info.raw;
      var summaryInfo = info.summary;
      var properties = rawData[info.dbpediaUrl];
	  console.log(info.summary.title)
	  console.log(info.summary.description);
	  openInfo(info.summary.title, info.summary.description);

      for (key in summaryInfo) {
        $('.summary .' + key).text(summaryInfo[key]);
      }
 
      //var dataAsJson = JSON.stringify(summaryInfo, null, '    ')
      //$('.summary .raw').val(dataAsJson);

 	};

	// function to initialize the keys
	function initialize () {
		// getting the credential through calling getKeys()
		// which is available in Global scope because of keys.js
		var keys = getKeys() || {}

		var clientId = keys["CLARIFAI_CLIENT_ID"]
		var clientSecret = keys["CLARIFAI_CLIENT_SECRET"]

		if (!clientId || !clientSecret) {
			app.html("Enter your Clarifai's Client ID and Client Secret in order to successfully run this demo. Go to developer.clarifai.com, sign up and create your application if you haven't already. You'll have to edit keys.js file to enter your credentials")
		}
		else {
			appClarifai = new Clarifai.App({apiKey: '7fe98b11f3ef4db58d52e092c1349f8a'});		
		}


	}
}(jQuery, Clarifai));