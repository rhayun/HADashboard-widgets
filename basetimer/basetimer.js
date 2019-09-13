function basetimer(widget_id, url, skin, parameters)
{
    // Will be using "self" throughout for the various flavors of "this"
    // so for consistency ...
    
    self = this
    
    // Initialization
    
    self.widget_id = widget_id
    
    // Parameters may come in useful later on
    
	self.parameters = parameters
    
    // Define callbacks for on click events
    // They are defined as functions below and can be any name as long as the
    // 'self'variables match the callbacks array below
    // We need to add them into the object for later reference
   
	var callbacks = []
	
	if ("monitored_entity" in self.parameters)
    {
        entity = self.parameters.monitored_entity
    }
    else
    {
        entity = self.parameters.entity
	}
	
	self.OnStateAvailable = OnStateAvailable;
    self.OnStateUpdate = OnStateUpdate;    
	
	if ("entity" in parameters)
    {
        var monitored_entities = [
            {"entity": parameters.entity, "initial": self.OnStateAvailable, "update": self.OnStateUpdate}
        ]
    }
    else
    {
        var monitored_entities =  []
	}
	
    // Finally, call the parent constructor to get things moving
    
    WidgetBase.call(self, widget_id, url, skin, parameters, monitored_entities, callbacks)  

    // Function Definitions
    
    // The StateAvailable function will be called when 
    // self.state[<entity>] has valid information for the requested entity
    // state is the initial state
	
	self.interval = '';
	self.isRunning = false;

	function OnStateAvailable(self, state)
    {
		if (state.state == "active" && !self.isRunnings) {
			startCountdown(self, state);
		}
		else {
			resetFields(self);
			self.set_field(self, "time", self.parameters.fields.idle_text);
			clearInterval(self.interval);
		}
	}
 
    function OnStateUpdate(self, state)
    {
		clearInterval(self.interval);
		if (state.state == "active" && !self.isRunnings) {
			startCountdown(self, state);
		}
	}

	function startCountdown(self, state)
	{
		self.isRunning = true;
		// console.log(state.attributes.remaining);
		var lastUpdate = new Date(state.last_updated);
		var secondsRemaining = hmsToSecondsOnly(state.attributes.remaining);
		var minutesRemaining = secondsRemaining / 60;
		var targetTime = addMinutes(lastUpdate, minutesRemaining);
		
		self.interval = setInterval(function() {
			// Get today's date and time
			var today = new Date();
			var now = today.getTime();
		  
			// Find the distance between now and the count down date
			var distance = targetTime - now;
		  
			// Time calculations for days, hours, minutes and seconds
			var days = Math.floor(distance / (1000 * 60 * 60 * 24) / 1000);
			var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
			var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
			var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		  
			time = formatTime(hours) + ":" + formatTime(minutes) + ":" + formatTime(seconds);
			console.log(time);

			if (days && days > 0) {
				var days_text = self.parameters.fields.days_text;
				if (days > 1) {
					var days_text = self.parameters.fields.days_text_plural;
				}
				
				self.set_field(self, "days", days);
				self.set_field(self, "days_text", days_text);
			}
			else {
				self.set_field(self, "days", '');
				self.set_field(self, "days_text", '');
			}

			self.set_field(self, "time", time);

			// If the count down is finished, write some text
			if (distance < 1000) {
				resetFields(self);
				self.set_field(self, "time", self.parameters.fields.times_up_text);
				stopCountDown(self);
			}

		}, 1000);
	}

	function stopCountDown(self)
	{
		self.isRunning = false;
		clearInterval(self.interval);
	}

	function hmsToSecondsOnly(str) {
		var seconds = 0;

		if (str.includes("day") || str.includes("days")) {
			var a = str.split("days,");
			if (a.length > 1) {
				seconds += Math.floor(parseInt(a[0].trim()) * (1000 * 60 * 60 * 24));
				str = str.replace(/(\d+) days\,/,'').trim();
			}
			var a = str.split("day,");
			if (a.length > 1) {
				seconds += Math.floor(parseInt(a[0].trim()) * (1000 * 60 * 60 * 24));
				str = str.replace(/(\d+) day\,/,'').trim();
			}
		}

		a = str.split(':');
		return seconds + (a[0]) * 60 * 60 + (+a[1]) * 60 + (+a[2]);
	}

	function resetFields(self)
	{
		self.set_field(self, "days", "");
		self.set_field(self, "days_text", '');
		self.set_field(self, "time", '');
	}

	function addMinutes(date, minutes) {
		return new Date(date.getTime() + minutes*60000);
	}

	function formatTime(i)
	{
		if (i < 10 )
		{
			return "0" + i;
		}
		else
		{
			return i;
		}
	}

}
