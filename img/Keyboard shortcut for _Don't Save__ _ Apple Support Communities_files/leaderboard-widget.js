$j(function ($) {

    var data = {}
        data.numResults = '10',
        data.timeFrame = 'weekly';

    $toolTipIcon = '<span class="tooltipDiv"><img id="tooltip-icon" src="/themes/apple/img/asc_rr_tooltip_icon_1x.png"/></span>'
    $j($toolTipIcon).appendTo(".jive-widget.jive-box.j-rc5.jive-widget-leaderboardwidget .jive-widget-handle");

    $(document).on('click','.js-leader', function(){
        data.currentUserId = currentUserId;
        data.frameID = frameId;
        data.widgetID = widgetId;
        data.containerID = containerID;     // ${targetObj.id} this needs to come in dynamically jive.global.containerId
        data.widgetType = widgetType;
        data.containerType = containerType;
        data.size = containerSize;

        if($(this).data("type") == "timeframe"){
            data.timeFrame = $(this).data('timeframe');
        } else {
           data.numResults = $(this).data('numberusers');
        }

        $.ajax({
                  type: 'GET',
                  url: '/render-widget!execute.jspa',
                  data: data,
                  success: function(data){
                    templateLeaderboard.init(data);
                  },
                  error: function(data){
                  }
              });
    });
    function tipsContainer(html) {
        $quesAns = '<div id="tips-container">' + '<p>' + tooltipMessage + '</p>' +
            '</div>';

        if ($j('#tips-container').length <= 0) {
            $j($quesAns).lightbox_me({
                centered: true
            }).appendTo(".tooltipDiv");
        }
    };

    $j('#tooltip-icon').on("click", function() {
        tipsContainer($);
    });

    $j(document).on('click','.js_lb_overlay',function(){
        $j('#tips-container').remove();
    });

    $j('.s-button').click(function(){
        $j('.s-button').removeClass('active');
        $j(this).toggleClass('active');
    });

    $j('.color-code').click(function(){
        $j('.color-code').removeClass('active');
        $j(this).toggleClass('active');
    });
});

templateLeaderboard = {

    loading: function(){
        //do something while request is made...
    },

    removeloading: function(){
        //do something while request is made...
    },

    init: function(data){

        $('.jive-widget-topmembers ul').html("");
        $('.jive-widget-topmembers ul').append(data);

    }

}



