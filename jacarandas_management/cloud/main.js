
// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("sendEmail", function(request, response) {
	var Mailgun = require('mailgun');
	Mailgun.initialize('unojaq.com', 'key-aebe1dc273b3d018db75c83ae17fb352');
  Mailgun.sendEmail({
  to:request.params.to,
  from: request.params.from,
  subject: request.params.subject,
  text:request.params.text
	}, {
	  success: function(httpResponse) {
	    console.log(httpResponse);
	    response.success("Email sent!");
	  },
	  error: function(httpResponse) {
	    console.error(httpResponse);
	    response.error(httpResponse);
	  }
	});
});
