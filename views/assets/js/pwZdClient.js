
	var person = {
		email : 'customer@example.com'
	};

	var zenCard;

	try {
		var pwSdkObj = PWSDK.init();
	} catch(err) {
		console.log(err);	
	}

	$(function() {
		
		if (pwSdkObj) {
			pwSdkObj.setAppUI({height: 300});
			pwSdkObj.getContext().then(function(data) {
				person.email = data.context.primary_email;
				fetchZendeskTicketsByEmail(person);
				console.log('CONTEXT OBJECT:' + data.context);
			});
		}

		zenTicketsList = new Vue({
			el: '#zenTicketsList',
			data: {
			user: '',
			items: [],
			status: 'new',
			newTicketUrl: 'https://billmcphersonhelp.zendesk.com/hc/en-us/requests/new'
			}
		})

		function capitalizeFirstLetter(string) {
			return string.charAt(0).toUpperCase() + string.slice(1);
		}

		function fetchZendeskTicketsByEmail(person){
			$.ajax({
			type: 'GET',
			dataType: 'json',
			data: person,
			url: '/zeninfo',
			success: function(result) {
				console.log(result);
				zenTicketsList.status = 'success';
				zenTicketsList.items = [];
				$.each(result, function(index){

					var ticketUrl = result[index].url.replace('/api/v2', '').replace('.json','');
					var user = result[index].requester_id
					var created = new Date(result[index].created_at);
					var created_formatted = 
						created.getMonth()+1 + '-' + 
						created.getDate() + '-' + 
						created.getFullYear();
					
					zenTicketsList.items.push({
						ticketId : result[index].id,
						subject : result[index].raw_subject, 
						priority : result[index].priority, 
						url : result[index].url, 
						status : result[index].status,
						type : result[index].type,
						description : result[index].description,
						tags : result[index].tags,
						url : ticketUrl,
						created : created_formatted
					});

					if (pwSdkObj) { pwSdkObj.setAppUI({ count: zenTicketsList.items.length }); }

					if(zenTicketsList.user == '') { zenTicketsList.user = user; }

				});
			},

			error: function(result) {
				console.log(result);
				zenTicketsList.status = 'error';
			}

			});
		}

		//$("button").on("click", fetchZendeskTicketsByEmail(person.email));

		if (!pwSdkObj) {
			console.log('no context object...fetching tickets for default email:' + person.email)
			fetchZendeskTicketsByEmail(person);
		}

	});