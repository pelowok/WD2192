var popupClose;

$j(function($) {

    if(isBeta == "true"){
        $(document).on('click','a.jive' + 'TT-hover-user', function(e){
            e.preventDefault();
            window.selected = $(this);
            popupClose = $(this);
            var userIds = $(this).data('userid') || $(this).data('userId');
            cardModal.init(userIds);
        });
    }
});

var cardModal = {
    init: function(userIds){
        var self = this;
        jqxhr = $.ajax({
            url: window.profileShortUrl,
            type:'POST',
            dataType : 'html',
            data: {
                userID : userIds,
                tooltip: false
            }
        }).success(function(data) {
            $('.j-people-list-modal').remove();
            self.populateModal(data);
        }).error(function(data) {
            console.log(data);
        });
    },
    tabIndexSpec: function(){
        $("#jive-note-body ul li a").each(function (i) { $(this).attr('tabindex', i+1 ); });
        $('.bottom-wrapper  a').keyup(function(event){
             if($('.footer-container a').length > 0){
                 if(event.keyCode == 9){
                     $('.js-close-mission').focus();
                 }
             }
        });
        // after pressing tab for tabindex enter is not working
        $('#body-apple').attr('tabindex','-1');
        $('#body-apple').attr('aria-hidden','true');
    },
    populateModal: function(modalData) {
        var self = this;
        if($('#jive-note-user-body-2').length <= 0 ){
           $("body").append(modalData);
           $('#jive-note-user-body-2').lightbox_me({
                centered: true,
                onLoad: function(){
                    self.tabIndexSpec();
                    window.convertSVG('.jive-tooltip2');
                }
            });
        }
    }
}
;
jQuery(document).ready(function ($) {

	$(document).on('click','.js-close-modal',function(){
		$('body').find('.js_lb_overlay').remove();
		$('#jive-note-user-body-2').trigger('close');
		$('body').find('#jive-note-user-body-2').remove();
		window.selected.focus();
		window.selected.css('opacity','1');
	});

	//Remove menu
	$(document).on('click','.js-close',function(){
		$('#body-apple').removeAttr('tabindex');
		$('#body-apple').attr('aria-hidden','false');
		$('#j-satNav-menu').trigger('close');
	});

	$(document).on('keyup',function(e) {
		if (e.keyCode == 27) {
			window.selected.focus();
			window.selected.css('opacity','1');
			$('#body-apple').removeAttr('tabindex');
            $('#body-apple').attr('aria-hidden','false');
			$('#jive-note-user-body-2').trigger('close');
			$('body').find('#jive-note-user-body-2').remove();
			$('body').find('.js_lb_overlay').remove();
		}
	});

	$(document).on('click', function(event) {
		if (!$(event.target).closest('#j-satNav, #j-satNav-menu').length) {
			$('#body-apple').removeAttr('tabindex');
			$('#body-apple').attr('aria-hidden','false');
		}
	});



});

;
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
;
jive.namespace('apple');  // Creates the jive.OrgChart namespace if it does not already exist.

/**
 * Adds logic to auto fill the community based on products mentioned in the content subject and body
 *
 */
jive.apple.IntelligentCommunitySelector = jive.oo.Class.extend(function(protect) {
    this.init = function(options) {

        //console.log('init');
    	// private variables
        this.products = options.products;

        var delay = (function(){
			var timer = 0;
			return function(callback, ms){
				clearTimeout (timer);
				timer = setTimeout(callback, ms);
			};
        })();

		var handleKeystroke = function() {
			delay(function(){
				//console.log('keystroke');
        		var product = searchFieldsForFirstProduct();
        		if(product){
        			$j('#js-publishbar-place-input').val('').trigger('keystroke').val(product).trigger("keystroke");
			    } else {
			        $j('#js-publishbar-place-input').val('');
			    }

            }, 300 );
		}

        // listen for subject or body modification
        var that = this;
        $j('#subject').keyup(handleKeystroke);
        $j('#subject').click(handleKeystroke);
		// delay binding keyup to editor iframe to wait until it exists
		delay(function() {
			$j('#tinymce', $j('#wysiwygtext_ifr').contents()).keyup(handleKeystroke);
	        $j('textarea.usertext').keyup(handleKeystroke);

            $j('#tinymce', $j('#wysiwygtext_ifr').contents()).click(handleKeystroke);
            $j('textarea.usertext').click(handleKeystroke);
		},300);

		var getFirstProduct = function(text) {
			var firstProduct;
			var productIndex = -1;
			var enteredText = text.replace(/[^A-Z0-9]/ig, '');
			that.products.forEach(function(product) {
				var index = enteredText.toLowerCase().indexOf(product.toLowerCase());
				if(index != -1 && (index < productIndex || productIndex === -1)) {
					firstProduct = product;
					productIndex = index;
				}
			});
			return firstProduct;
		};

		var searchSubjectForFirstProduct = function() {
			var text = $j('#subject').val();
			var product = getFirstProduct(text);
			return product;
		};

		var searchEditorBodyForFirstProduct = function() {
			var editorBody = $j('#wysiwygtext_ifr').contents().find('#tinymce').clone();
			editorBody.find("br").replaceWith(" ");

			var text = editorBody.text();
			var product = getFirstProduct(text);
			return product;
		};

		var searchFieldsForFirstProduct = function() {
			var product = searchSubjectForFirstProduct();
			if(product) {
				return product;
			}
			product = searchEditorBodyForFirstProduct();
			return product;
		};

    };

});

;
if(typeof bv=="undefined"){var bv={}}if(typeof bv.visual=="undefined"){bv.visual={}}bv.visual.renderStatusLevel=function(A,C){var B=C||new soy.StringBuilder();B.append('<span class="j-status-levels">',(A.user.metadata)?'<img src="'+soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(A.user.metadata["userLevel"].imageUrl))+'" alt=""><span class="level-points">'+soy.$$escapeHtml(A.user.metadata["userLevel"].name)+" <span>("+soy.$$escapeHtml(A.user.metadata["userLevel"].points)+" "+soy.$$escapeHtml(jive.i18n.i18nText(jive.i18n.getMsg("jivemacro.points.label"),[]))+")</span> </span>":"","</span>");return C?"":B.toString()};bv.visual.renderMyRewards=function(A,G){var C=G||new soy.StringBuilder();if(A.user.metadata.isBetaUser){C.append('<div class="status-row reward-tile"><h3>',soy.$$escapeHtml(jive.i18n.i18nText(jive.i18n.getMsg("gamification.rewards"),[])),"</h3><ul>");if(typeof (A.user.metadata.rewards)=="undefined"){C.append('<li class="listTypeNone"><a href="',soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri("")),'">',soy.$$escapeHtml(jive.i18n.i18nText(jive.i18n.getMsg("gamification.learn.more.rewards"),[])),"...</a></li>")}else{if(A.user.metadata.rewards){var E=A.user.metadata.rewards;var F=E.length;for(var B=0;B<F;B++){var D=E[B];switch(B){case 0:case 1:case 2:case 3:case 4:case 5:case 6:case 7:case 8:C.append('<li class="listTypeNone popuplistspace"><a href="javascript:void(0)" class="target-mission" role="button" aria-label="',soy.$$escapeHtmlAttribute(D.name),'" aria-expanded="false" data-user="',soy.$$escapeHtmlAttribute(A.user.id),'"  data-type="reward" data-name="',soy.$$escapeHtmlAttribute(A.user.username),'" data-mid="',soy.$$escapeHtmlAttribute(D.id),'" data-parent="false"><div class="status-image ',soy.$$escapeHtmlAttribute(D.complete),'"><img src="',soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(D.imageUrl)),'" class="svg" alt="" /></div></a></li>');break;case 9:C.append('<li class="listTypeliNone"><a href="/people/',soy.$$escapeHtmlAttribute(A.user.username),'" role="button" aria-label="',soy.$$escapeHtmlAttribute(jive.i18n.i18nText(jive.i18n.getMsg("gamification.more.rewards"),[])),'" class="view-more">',soy.$$escapeHtml(jive.i18n.i18nText(jive.i18n.getMsg("gamification.more.rewards"),[])),"...</a></li>");break;default:}if(B==F-1){jive.shared.soy.resourceInlineJs({code:"window.convertSVG('.reward-tile'); $(\"#j-satNav-menu ul li a\").each(function (i) { $(this).attr('tabindex', i+1 ); });"},C)}}}}C.append("</ul></div>")}return G?"":C.toString()};bv.visual.renderMyExpertise=function(B,G){var C=G||new soy.StringBuilder();if(B.user.metadata.isBetaUser){C.append('<div class="status-row expertise"><h3>',soy.$$escapeHtml(jive.i18n.i18nText(jive.i18n.getMsg("gamification.expertise"),[])),"</h3><ul>");if(B.user.metadata.expertise){if(B.user.metadata.expertise==0){C.append('<li class="listTypeliNone"><a href="',soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri("/docs/DOC-9254")),'">',soy.$$escapeHtml(jive.i18n.i18nText(jive.i18n.getMsg("gamification.learn.more.expertise"),[])),"...</a></li>")}else{var F=B.user.metadata.expertise;var A=F.length;for(var D=0;D<A;D++){var E=F[D];switch(D){case 0:case 1:case 2:case 3:C.append('<li class="status-tile expertise-tile"><a href="javascript:void(0)" class="target-mission" role="button" aria-label="',soy.$$escapeHtmlAttribute(E.parentName),'" data-user="',soy.$$escapeHtmlAttribute(B.user.id),'" data-type="expertise" data-name="',soy.$$escapeHtmlAttribute(B.user.username),'" data-mid="',soy.$$escapeHtmlAttribute(E.id),'" data-parent="false"><div class="status-image"><img src="',soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(E.imageUrl)),'" class="svg"  alt="" /></div><span class="status-label">',soy.$$escapeHtml(E.parentName),'</span><span class="status-level sml"><span class="dashes level',(E.complete)?soy.$$escapeHtmlAttribute(E.absoluteOrder):soy.$$escapeHtmlAttribute(E.absoluteOrder-1),'"></span><span class="progress-dashes"></span></span></a></li>');break;case 4:C.append('<li class="listTypeliNone"><a href="/people/',soy.$$escapeHtmlAttribute(B.user.username),'" class="view-more">',soy.$$escapeHtml(jive.i18n.i18nText(jive.i18n.getMsg("gamification.more.expertise"),[])),"...</a></li>");break;default:}}}}C.append("</ul></div>")}return G?"":C.toString()};bv.visual.renderStatusLevelPeople=function(A,C){var B=C||new soy.StringBuilder();B.append('\t<span class="j-status-levels"><img src="',soy.$$escapeHtmlAttribute(soy.$$filterNormalizeUri(A.metadata["userLevel"].imageUrl)),'" alt="',soy.$$escapeHtmlAttribute(A.metadata["userLevel"].name),'" title="',soy.$$escapeHtmlAttribute(A.metadata["userLevel"].name),'"><span class="level-points">',soy.$$escapeHtml(A.metadata["userLevel"].name),"</span></span>");return C?"":B.toString()}
;
if(typeof apple=="undefined"){var apple={}}if(typeof apple.intelligentcommunityselector=="undefined"){apple.intelligentcommunityselector={}}apple.intelligentcommunityselector.main=function(A,C){var B=C||new soy.StringBuilder();B.append('<script type="text/javascript">$j(document).ready( function() {new jive.apple.IntelligentCommunitySelector({products: [',A.products,"]});});<\/script>");return C?"":B.toString()}
;
