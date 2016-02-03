var $ = $j;
var notification = {
    timeVisible: 16000,
    path: '/__services/v2/rest/notification/',
    userid: '',
    xt: 0,

    init: function(allNotifications,userId){
        this.userid = userId;
        this.callbackHandler(allNotifications);
    },

    callbackHandler: function(allNotifications){
        var self = this;
        this.show(allNotifications[this.xt],function(){
            self.xt++;
            if(self.xt < allNotifications.length) {
                self.callbackHandler(allNotifications);
            }
        });
    },

    show: function(options,callback){
        var timer,
        $eleWrapper = $('.notification-wrapper'),
        $eleName = $(".notification-container"),
        $ele = $('<div class="notification-container '+options.achievementClass+'"></div>'),
        self = this;

        //create wrapper if not exists
        if($eleWrapper.length==0){
            $('<div class="notification-wrapper"></div>').appendTo('body');
        }

        //to hide and start showing with effect
        $ele.hide();

        //mouseover on it, wont go off
        $ele.bind('mouseover',function(){
            if(timer){
                $ele.unbind('mouseout').bind('mouseout',function(){
                    timer = setTimeout(function(){
                        if(timer){
                            $ele.animate({height:'0px'},1000,'easeOutCubic',function(){
                                notification.closeNotification(options.levelName,callback);
                            });
                        }
                    },((self.timeVisible)-10000));
                });
                clearTimeout(timer);
                timer=null;
            }
        });
        var achievementStrforReward = options.levelName;
        var achievementStrforKey = options.achievementKey;
        var achievementStrForExpertise = options.achievementName;
        var n = achievementStrforKey.indexOf("stage");

        var achievementName = ((n == -1)?achievementStrforReward:achievementStrForExpertise);

        $ele.html('<a class="close-me"></a><img class="badge" src="'+ options.levelImagePath +'"/>'+
            '<h3>'+achievementName+'</h3>'+
            '<p class="msg">'+ options.achievementDescription +'</p>');
        $ele.appendTo('.notification-wrapper');

        //start animation
        setTimeout(function(){
            $ele.show().css('height','0px').animate({height:'170px'},1000,'easeOutCubic',function(){
                timer = setTimeout(function(){
                    if(timer){
                        self.closeNotification(options.levelName,callback);
                    }
                },self.timeVisible);
            });
        }, 1000);

        $('.close-me').unbind("click").click(function(){
            self.closeNotification(options.levelName,callback);
        });

        window.addEventListener('unload', function(event) {
            self.closeNotification(options.levelName,callback);
        });
    },

    //on click close button hide notification
    closeNotification: function(name,callback){
        var $ele = $(".notification-container"),
        self = this,
        removeit = $ele.animate({height:'0px'},1000,'easeOutCubic',function(){
            $ele.remove();
            callback();
        });
        self.updateNotified(name);
    },

    updateNotified: function(name){
        var url = this.path + this.userid + '/'+ name;
        $.ajax(url, {
            type: 'POST',
            dataType: 'json',
                success: function(data){
                    //console.log(data);
                },
                error: function(data){
                    //console.log(data);
                }
            }
        );

    }

};