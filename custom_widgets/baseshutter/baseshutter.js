function baseshutter(widget_id, url, skin, parameters)
{
    // Will be using "self" throughout for the various flavors of "this"
    // so for consistency ...
    
    self = this
    
    // Initialization
    
    self.widget_id = widget_id
    
    // Store on position or fallback to a default
        
    // Parameters may come in useful later on
    
    self.parameters = parameters
    // Parameter handling
    
    if ("monitored_entity" in self.parameters)
    {
        entity = self.parameters.monitored_entity
    }
    else
    {
        entity = self.parameters.entity
    }
    
    if ("on_position" in self.parameters)
    {
        self.on_position = self.parameters.on_position
    }
    else
    {
        self.on_position = 100
    }
       
    self.onChange = onChange
    self.OnUpClick = OnUpClick
    self.OnDownClick = OnDownClick
    self.OnPauseClick = OnPauseClick

    var callbacks = [
        {"selector": '#' + widget_id + ' #up', "action": "click", "callback": self.OnUpClick},
        {"selector": '#' + widget_id + ' #pause', "action": "click", "callback": self.OnPauseClick},
        {"selector": '#' + widget_id + ' #down', "action": "click", "callback": self.OnDownClick},
        {"selector": '#' + widget_id + ' > div > div > input', "action": "change", "callback": self.onChange},
    ]


    // Define callbacks for entities - this model allows a widget to monitor multiple entities if needed
    // Initial will be called when the dashboard loads and state has been gathered for the entity
    // Update will be called every time an update occurs for that entity
     
    self.OnStateAvailable = OnStateAvailable
    self.OnStateUpdate = OnStateUpdate
    
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
    // Methods

    function OnStateAvailable(self, state)
    {    
        self.state = state.state
        self.minvalue = 0
        self.maxvalue = 100
        self.stepvalue = 1
        if ("current_position" in state.attributes)
        {
            self.current_position = state.attributes.current_position
        }
        else
        {
            self.set_field(self, "PositionAvailableClass", 'row no-position')
            self.current_position = 0
        }
        controlsState(self, state);
        set_options(self, self.minvalue, self.maxvalue, self.stepvalue, self.current_position)
        set_view(self, self.state, self.current_position)
    }
 
    function OnStateUpdate(self, state)
    {
        self.state = state.state;
        if ("current_position" in state.attributes)
        {
            self.current_position = state.attributes.current_position
        }
        else
        {
            self.current_position = 0
        }

        controlsState(self, state);
        set_view(self, self.state, self.current_position)
    }

    function OnUpClick(self)
    {
        if (self.current_position != 100) {
            setTimeout(function() {
                args = self.parameters.post_service_open 
                self.call_service(self, args)
                
            },500)
        }
        
    }

    function OnPauseClick(self)
    {
        args = self.parameters.post_service_stop
        self.call_service(self, args)
    }

    function OnDownClick(self)
    {
        if (self.current_position != 0) {
            setTimeout(function() {
                args = self.parameters.post_service_close 
                self.call_service(self, args)
                
            },500)
        }
    }

    function onChange(self, state)
    {
        setTimeout(function() {
            var sliderPosition = Math.abs(self.ViewModel.Position() - 100);
            if (self.current_position != sliderPosition)
            {
                self.current_position = sliderPosition;
                args = self.parameters.post_service_position 
                args["position"] = self.current_position
                console.log(args);
                self.call_service(self, args)
            }
        },500)
    }

    function set_options(self, minvalue, maxvalue, stepvalue, state)
    {
        self.set_field(self, "MinValue", minvalue)
        self.set_field(self, "MaxValue", maxvalue)
        self.set_field(self, "CenterValue", (parseInt(maxvalue)-parseInt(minvalue))/2)
        self.set_field(self, "StepValue", stepvalue)
    }

    function set_view(self, state, current_position)
    {
        if (typeof current_position == 'undefined')
        {
            self.set_field(self, "Position", 0)
        }
        else
        {
            var currentPosition = Math.abs(current_position - 100)
            self.set_field(self, "Position", currentPosition)
        }
    }

    // Helper function to get the element id from the class name.
    function element(self,class_name)
    {
        return document.getElementById(self.widget_id).getElementsByClassName(class_name)[0] 
    }

    function controlsState(self, state)
    {
        if ("current_position" in state.attributes)
        {
            if (self.current_position == 0) {
                element(self, "down").style.color = "gray"
                element(self, "down").style.cursor = "not-allowed"
                element(self, "up").style.color = "white"
                element(self, "up").style.cursor = "pointer"
            }
            else if (self.current_position == 100) {
                element(self, "down").style.color = "white"
                element(self, "down").style.cursor = "pointer"
                element(self, "up").style.color = "gray"
                element(self, "up").style.cursor = "not-allowed"
            }
            else {
                element(self, "down").style.color = "white"
                element(self, "down").style.cursor = "pointer"
                element(self, "up").style.color = "white"
                element(self, "up").style.cursor = "pointer"
            }
        }
    }

}
