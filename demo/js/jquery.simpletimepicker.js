(function($) {
    
    $.fn.simpleTimePicker = function(action, options) {
        
        if(typeof(action) == 'object' || !action) {
            options = action;
            action = 'initialize';
        }
        
        this.each(function() {
            var input = $(this);
            
            if(action == 'initialize') {
                
                var settings = setOptions(input);
                
                var list = $('<ol></ol>').attr({
                   'class': 'simpletimepicker-list'
                });
                
                var start_h = parseInt(settings.start_time.split(':')[0]);
                var start_m = parseInt(settings.start_time.split(':')[1]);
                var end_h = parseInt(settings.end_time.split(':')[0]);
                var end_m = parseInt(settings.end_time.split(':')[1]);
                
                settings.start_minutes = start_h*60 + start_m;
                settings.end_minutes = end_h*60 + end_m;
                settings.interval_minutes = parseInt(settings.interval);
                
                for(var m = settings.start_minutes ; m <= settings.end_minutes ; m += settings.interval_minutes) {
                    
                    var h_str = ''+Math.floor(m/60);
                    var m_str = ''+m%60;
                    
                    while(h_str.length < 2) h_str = '0' + h_str;
                    while(m_str.length < 2) m_str = '0' + m_str;
                    
                    var a = $('<a></a>').attr({
                        'href': 'javascript: void(0);'
                    }).text(h_str+':'+m_str).click(function() {
                        
                    });
                    list.append(
                        $('<li></li>').append(a)
                    );
                }
                
                list.delegate('a', 'click', function(e) {
                    input.val($(this).text());
                    input.simpleTimePicker('close');
                    e.preventDefault();
                });
                
                list.hide();
                
                input.after(list);
                settings.list = list;
                settings.timepicker_open = false;
                
                if(settings.show_on) {
                    input.parent().find(settings.show_on).click(function(e) {
                        if(!input.attr('disabled')) {
                            input.focus();
                            input.simpleTimePicker('toggle');
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    })
                } else {
                    input.focus(function() {
                        input.simpleTimePicker('open');
                    });
                }
                $(document).click(function(e) {
                    if(e.target != input.get(0)) input.simpleTimePicker('close');
                })
                
            } else if(action == 'open') {
                
                var settings = input.data('simpleTimePicker-options');
                
                var top_offset_offset = 0;
                if(settings.scroll_to_now) {
                    var now = new Date();
                    var now_minutes = now.getHours()*60 + now.getMinutes();
                    top_offset_offset = - Math.floor((now_minutes - settings.start_minutes) / settings.interval_minutes)
                     * settings.list.find('a:first').outerHeight(true);
                    if(top_offset_offset > 0) top_offset_offset = 0;
                }
                
                settings.list.css({
                    'position': 'absolute',
                    'top': input.position().top + top_offset_offset,
                    'left': input.position().left + input.outerWidth() + settings.distance_left
                }).show();
                
                // Clamp to window edges
                
                settings.list.css({'top': '-=' + Math.min(0, settings.list.position().top)});
                settings.list.css({'top': '+=' + Math.min(0, $(window).height()-settings.list.position().top-settings.list.height())});
                
                settings.timepicker_open = true;
                
                
            } else if(action == 'close') {
                
                var settings = input.data('simpleTimePicker-options');
                settings.list.hide();
                
                settings.timepicker_open = false;
                
                
            } else if(action == 'toggle') {
                
                var settings = input.data('simpleTimePicker-options');
                
                if(settings.timepicker_open) {
                    input.simpleTimePicker('close');
                } else {
                    input.simpleTimePicker('open');
                }
                
            }
            
        });
        
        function setOptions($element) {
            options = $.extend({}, $.fn.simpleTimePicker.defaults, $element.data('simpleTimePicker-options'), options);
            $element.data('simpleTimePicker-options', options);
            return options;
        };
    };
    
    $.fn.simpleTimePicker.defaults = {
        start_time: '9:00',
        end_time: '22:30',
        interval: '30',
        show_on: null,
        distance_left: 0,
        scroll_to_now: true
    };
    
})(jQuery);
