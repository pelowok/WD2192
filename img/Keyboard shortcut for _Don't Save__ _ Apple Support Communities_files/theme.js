// theme javascript.

jQuery(document).ready(function ($) {
    // jQuery can be used inside with the $ shortcut. 
    

	// [ACS-239] ADD NO FOLLOW TO: user profile links
    $("a[href*='/people']").each(function(){
        var url = $j(this).attr("href");
        // make sure it's an internal link
        if(url.indexOf("http://" + window.location.host) >= 0 || url.substring(0,1) == "/") {
            $(this).attr("rel", "nofollow");
        };
    });


    //setup howto write toggle link, this is on the create discussion/thread page
	var $howtowrite = $('.apple-howto-write');
	// check to see if the element exists on the page
	// as we don't want to setup an event binding if it doesn't
	if ( $howtowrite.length > 0 ) {
		$howtowrite.find('a').on('click', function() {
			// toggle the open class
			$howtowrite.toggleClass('open');

			// check for the 'open' class and show or hide the text block based on it's presence
			var $howtowriteText = $('.apple-howto-write-text');
			if( $howtowrite.hasClass('open') ) {
				$howtowriteText.slideDown();
			} else {
				$howtowriteText.slideUp();
			}
		});
	}

	//
	// ask a question widget
	// close the results when the input loses focus
	//
	var $askWidgetInput = $('.ask-a-question-search');
	if ( $askWidgetInput.length > 0 ) {
		$askWidgetInput.on('blur', function(){
			$askWidgetInput.siblings('.ask-a-question-results').fadeOut('fast');
		});
	}

});//jQuery(document).ready(function ($) {


//
// custom iOS style toggles
//

iosToggleInit = function() {
    $j.support.borderRadius = false;
    $j.each(['borderRadius','MozBorderRadius','WebkitBorderRadius','OBorderRadius','KhtmlBorderRadius'], function() {
        if (document.body.style[this] !== undefined) $j.support.borderRadius = true;
    });

    var iosAllToggles = $j(document).find('.ios-toggle');

    if (!$j.support.borderRadius) {
    	iosAllToggles.removeClass('ios-toggle').addClass('old-school-radios');
        $j('.ios-switch').hide();
        $j('.ios-toggle label').show();
        $j('.ios-toggle input[type="radio"]').show();
    } else {
        iosAllToggles.each(function(i){
            var toggles = $j(this).find('input[type="radio"]');
            if (toggles.eq(0).is(':checked')) {
                //$j(this).find('.ios-switch').css('backgroundPosition', '-37');
                $j(this).find('.ios-switch').css('backgroundPosition', '0 0');
            } else { 
                //$j(this).find('.ios-switch').css('backgroundPosition', '0');
                $j(this).find('.ios-switch').css('backgroundPosition', '-37px 0');
                toggles.eq(1).prop('checked', true);
            }
        });
    }
};

iosToggleInit1 = function() {
    $j.support.borderRadius = false;
    $j.each(['borderRadius','MozBorderRadius','WebkitBorderRadius','OBorderRadius','KhtmlBorderRadius'], function() {
        if (document.body.style[this] !== undefined) $j.support.borderRadius = true;
    });

    var iosAllToggles = $j(document).find('.ios-toggle');

    if (!$j.support.borderRadius) {
    	iosAllToggles.removeClass('ios-toggle').addClass('old-school-radios');
        $j('.ios-switch-ja').hide();
        $j('.ios-toggle label').show();
        $j('.ios-toggle input[type="radio"]').show();
    } else {
        iosAllToggles.each(function(i){
            var toggles = $j(this).find('input[type="radio"]');
            if (toggles.eq(0).is(':checked')) {
                //$j(this).find('.ios-switch').css('backgroundPosition', '-37');
                $j(this).find('.ios-switch-ja').css('backgroundPosition', '0 0');
            } else {
                //$j(this).find('.ios-switch').css('backgroundPosition', '0');
                $j(this).find('.ios-switch-ja').css('backgroundPosition', '-37px 0');
                toggles.eq(1).prop('checked', true);
            }
        });
    }
};

iosToggleInitKo = function() {
    $j.support.borderRadius = false;
    $j.each(['borderRadius','MozBorderRadius','WebkitBorderRadius','OBorderRadius','KhtmlBorderRadius'], function() {
        if (document.body.style[this] !== undefined) $j.support.borderRadius = true;
    });

    var iosAllToggles = $j(document).find('.ios-toggle');

    if (!$j.support.borderRadius) {
    	iosAllToggles.removeClass('ios-toggle').addClass('old-school-radios');
        $j('.ios-switch-ko').hide();
        $j('.ios-toggle label').show();
        $j('.ios-toggle input[type="radio"]').show();
    } else {
        iosAllToggles.each(function(i){
            var toggles = $j(this).find('input[type="radio"]');
            if (toggles.eq(0).is(':checked')) {
                //$j(this).find('.ios-switch').css('backgroundPosition', '-37');
                $j(this).find('.ios-switch-ko').css('backgroundPosition', '0 0');
            } else {
                //$j(this).find('.ios-switch').css('backgroundPosition', '0');
                $j(this).find('.ios-switch-ko').css('backgroundPosition', '-37px 0');
                toggles.eq(1).prop('checked', true);
            }
        });
    }
};

iosToggleInitCn = function() {
    $j.support.borderRadius = false;
    $j.each(['borderRadius','MozBorderRadius','WebkitBorderRadius','OBorderRadius','KhtmlBorderRadius'], function() {
        if (document.body.style[this] !== undefined) $j.support.borderRadius = true;
    });

    var iosAllToggles = $j(document).find('.ios-toggle');

    if (!$j.support.borderRadius) {
    	iosAllToggles.removeClass('ios-toggle').addClass('old-school-radios');
        $j('.ios-switch-cn').hide();
        $j('.ios-toggle label').show();
        $j('.ios-toggle input[type="radio"]').show();
    } else {
        iosAllToggles.each(function(i){
            var toggles = $j(this).find('input[type="radio"]');
            if (toggles.eq(0).is(':checked')) {
                //$j(this).find('.ios-switch').css('backgroundPosition', '-37');
                $j(this).find('.ios-switch-cn').css('backgroundPosition', '0 0');
            } else {
                //$j(this).find('.ios-switch').css('backgroundPosition', '0');
                $j(this).find('.ios-switch-cn').css('backgroundPosition', '-37px 0');
                toggles.eq(1).prop('checked', true);
            }
        });
    }
};

jQuery(document).ready(function ($) {
	$iosSwitches = $('.ios-switch');
	if($iosSwitches.length > 0) {
		iosToggleInit();
		$iosSwitches.on('click', function(e) {
		    var toggleRadios = $(e.target).closest('.ios-toggle').find('input[type="radio"]');
		    if (toggleRadios.eq(0).is(':checked')) {
		        toggleRadios.eq(0).prop('checked', false); 
		        toggleRadios.eq(1).prop('checked', true);
		        $(e.target).animate({'backgroundPosition' : '-37'}, 150, 'linear');
		    } else { 
		        toggleRadios.eq(0).prop('checked', true); 
		        toggleRadios.eq(1).prop('checked', false); 
		        $(e.target).animate({'backgroundPosition' : '0'}, 150, 'linear');
		    }
		});
	}
    $iosSwitches1 = $('.ios-switch-ja');
    if($iosSwitches1.length > 0) {
        iosToggleInit1();
        $iosSwitches1.on('click', function(e) {
            var toggleRadios = $(e.target).closest('.ios-toggle').find('input[type="radio"]');
            if (toggleRadios.eq(0).is(':checked')) {
                toggleRadios.eq(0).prop('checked', false);
                toggleRadios.eq(1).prop('checked', true);
                $(e.target).animate({'backgroundPosition' : '-37'}, 150, 'linear');
            } else {
                toggleRadios.eq(0).prop('checked', true);
                toggleRadios.eq(1).prop('checked', false);
                $(e.target).animate({'backgroundPosition' : '0'}, 150, 'linear');
            }
        });
    }
    $iosSwitches2 = $('.ios-switch-ko');
    if($iosSwitches2.length > 0) {
        iosToggleInitKo();
        $iosSwitches2.on('click', function(e) {
            var toggleRadios = $(e.target).closest('.ios-toggle').find('input[type="radio"]');
            if (toggleRadios.eq(0).is(':checked')) {
                toggleRadios.eq(0).prop('checked', false);
                toggleRadios.eq(1).prop('checked', true);
                $(e.target).animate({'backgroundPosition' : '-37'}, 150, 'linear');
            } else {
                toggleRadios.eq(0).prop('checked', true);
                toggleRadios.eq(1).prop('checked', false);
                $(e.target).animate({'backgroundPosition' : '0'}, 150, 'linear');
            }
        });
    }
    
    $iosSwitches3 = $('.ios-switch-cn');
    if($iosSwitches3.length > 0) {
        iosToggleInitCn();
        $iosSwitches3.on('click', function(e) {
            var toggleRadios = $(e.target).closest('.ios-toggle').find('input[type="radio"]');
            if (toggleRadios.eq(0).is(':checked')) {
                toggleRadios.eq(0).prop('checked', false);
                toggleRadios.eq(1).prop('checked', true);
                $(e.target).animate({'backgroundPosition' : '-37'}, 150, 'linear');
            } else {
                toggleRadios.eq(0).prop('checked', true);
                toggleRadios.eq(1).prop('checked', false);
                $(e.target).animate({'backgroundPosition' : '0'}, 150, 'linear');
            }
        });
    }


});//jQuery(document).ready(function ($) {