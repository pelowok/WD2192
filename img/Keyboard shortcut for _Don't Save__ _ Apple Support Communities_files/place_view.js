/*
 * $Revision$
 * $Date$
 *
 * Copyright (C) 1999-2011 Jive Software. All rights reserved.
 *
 * This software is the proprietary information of Jive Software. Use is subject to license terms.
 */

jive.namespace('PublishBar');

/**
 * Handles UI for a list of places in the publish bar places option.
 *
 * emits "search", "browse", "suggest", "selectPlace"
 *
 * @extends jive.AbstractView
 * @param {jQuery|Element|String} input search field
 *
 * @depends path=/resources/scripts/lib/jiverscripts/src/conc/next_tick.js
 * @depends path=/resources/scripts/jquery/jquery.suggestBox.js
 * @depends template=jive.publishbar.placeSearchResults scope=client
 */
jive.PublishBar.PlaceView = jive.oo.Class.extend(function(protect) {
    jive.conc.observable(this);

    this.init = function(input) {
        var view = this;
        this.$input = $j(input);

        this.$input.suggestBox({
            typeAheadOptions: {
                itemSelector: "li:visible:has('a')"
            },
            queryFunc: function searchOrSuggest(searchString) {
                if (!searchString || searchString.trim() == '') {
                    return view.emitP('suggest');
                }
                else {
                    return view.emitP('search', searchString);
                }
            },
            processResults: function(results, typeAhead, searchString){
                var isSuggested = !searchString || searchString.trim() == '';
                return $j.extend({
                    suggested: isSuggested,
                    communityFeatureVisible: jive.global.communityFeatureVisible
                }, results);
            },
            template: function(results){
                return jive.publishbar.placeSearchResults(results);
            },
            displayEmptySearch: true,
            popoverOptions: {
                flip: false,
                addClass: "j-autocomplete j-placePicker"
            }
        }).on("selectionChosen", function(ev, typeAhead, $selected){
            $selected = $selected.find("a");
            view.selectPlace($selected.data('objecttype'), $selected.data('objectid'));
            view.$input.trigger("close");
        }).on("focusWaitFinished", function(){
            view.$input.trigger("keystroke");
        });

        $j('#js-publishbar-place-browse').click(function(e) {
            view.emit('browse');
            e.preventDefault();
        });
    };

    // used to render the place view after a place is selected.
    this.selectPlace = function(containerType, containerID) {
        this.emit('selectPlace', containerType, containerID);
    };
});
