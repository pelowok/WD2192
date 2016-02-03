var reqInProgress = false;
var clickedImage;
var closePopup;
$j(function ($) {
    $(document).on('click','.target-mission', function(){
        var requestData = {};
        clickedImage = $(this);
        if($('body').find('.modal-container').length){
            window.modalSelected = $(this);
        } else {
            window.selected = $(this);
        }
        closePopup = window.selected;
        $(this).css('opacity', '.5');
        $(this).attr('aria-expanded', 'true');
        requestData.userID = $(this).data('user'),
        requestData.missionID  = $(this).data('mid'),
        requestData.parentContainer = $(this).data('parent'),
        requestData.targetUsername = $(this).data('name'),
        requestData.badgeType = $(this).data('type');
        if(!reqInProgress){
          reqInProgress=true;
          templateModal.init(requestData, this);
        }
    });

    $(document).on('click','.js-close-mission',function(e){
        var target = $(this).parent('div'),
        closeid = $(this).data('target');
        if(clickedImage !== null || clickedImage !== 'undefined') {
            clickedImage.attr('aria-expanded', 'false');
        }
        templateModal.closeModal(target, closeid);
    });

    $(document).on('click','.js_lb_overlay',function(){
        $(this).remove();
        templateModal.clearit();
    });

});

var $ = $j;
var loadingFunc = {
    loadInProgress : false,
    fadeAsTransition: false,
    loadingSequence : 'loadingInProgress',
    target : '',
    loading: function(){
        this.target = $('.j-pop-visible2').length ? '.j-pop-visible2' : '#jive-note-user-body-2';
        this.loadInProgress = true;
        if(this.$fadeAsTransition){
            $(this.target).fadeTo(200 , 0.2);
        }
        $(this.target).addClass(this.loadingSequence);
    },
    removeLoading: function(){
        this.loadInProgress = false;
        if(this.$fadeAsTransition){
            $(this.target).fadeTo(200 , 1);
        }
        $(this.target).removeClass(this.loadingSequence);
        setTimeout(function() {
            $('.mission-track').addClass('show');
        }, 400);
    }
},

rewardProgress = {
    init: function(data){
        var rewards = document.getElementsByClassName('criteria-select');
        for (var i = 0; i < rewards.length; ++i) {
           var rewardId = rewards[i].getAttribute("data-vendor");
               target = rewards[i].getAttribute("data-target");
           this.fetch(rewardId, target);
        }
    },
    fetch: function(rewardId, target){
        var playerId = playerID;
        BVSDK.all(
            BVSDK( 'players/progresses', { players: playerId }, {fields: 'all',query: { type: 'all_rewards', definition_id: rewardId }})
        ).ok( function( playerRewardProgress ) {
            if(playerRewardProgress.progresses.length == 0){
               $criteriaMark = '<span class="times target-progress">1x</span>';
               $percent = 0;
            } else {
                if ((playerRewardProgress.progresses[0].possible-playerRewardProgress.progresses[0].earned) == 0) {
                    $criteriaMark = '<img src="/plugins/gamification-plugin/resources/img/Checkmark.svg"/>';
                    $percent = playerRewardProgress.progresses[0].percent;
                } else {
                    $criteriaMark = '<span class="times target-progress">'+(playerRewardProgress.progresses[0].possible-playerRewardProgress.progresses[0].earned)+'x</span>';
                    $percent = playerRewardProgress.progresses[0].percent;
                }
            }

            $('.'+target+ ' .knockout').html($criteriaMark);
            $('.'+target).addClass('progress-'+$percent+ ' vis');
        }).fail( function( data ) {
            //console.log(data);
        });
    }
},

templateModal = {
    containerWidth: '',
    modalContainer : '.modal-container',
    init: function(data, target){
        var self = this;
        $.ajax('/mission-modal.jspa', {
            type: 'POST',
            data: data,
                success: function(data){
                    self.modal(data, target);
                    reqInProgress = false;
                },
                error: function(data){
                    reqInProgress = false;
                }
            }
        );
    },

    modal: function(data, target){
        loadingFunc.loading();
        this.modalContainer = '.modal-container'
        this.containerWidth = $(this.modalContainer+'>div').outerWidth(true);
        var result = $(data).filter('div.mission-track');
        if($('body').find(this.modalContainer).length){
            $(this.modalContainer).append(result);
            $(this.modalContainer).animate({
                marginLeft: "-="+this.containerWidth
            }, 400);
            loadingFunc.removeLoading();
            rewardProgress.init(result);
            $("a").blur();
            setTimeout(function(){
                $(target).css('opacity','1');
            }, 800);
        } else {
            $("body").append(data);
            $("#jive-note-user-body-2").lightbox_me({
                centered: true,
                onLoad: function(){
                    loadingFunc.removeLoading();
                    rewardProgress.init(result);
                }
            });
        }
    },

    closeModal: function(target, name){
        this.containerWidth = $(this.modalContainer+'>div').outerWidth(true);
        if($(this.modalContainer+'>div').length > 1){
            $(".js-close-mission").blur();
            $(this.modalContainer).animate({
                marginLeft: "+="+this.containerWidth
            }, 400, function(){
                $(target).remove();
                window.modalSelected.focus();
            });
        } else {
            templateModal.clearit();
        }
    },

    clearit: function(){
        $('#jive-note-user-body-2').trigger('close');
        $('body').find('#jive-note-user-body-2').remove();
        $('body').find('.js_lb_overlay').remove();
        window.selected.focus();
        window.selected.css('opacity','1');
    }
};