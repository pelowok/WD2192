// ==============================================================================================================
// http://cdn2.hubspot.net/hub/120076/file-2396857908-js/max_extra/RM/js/distributors_static_b.js?t=1425901504000
// ==============================================================================================================
/**

 * distributors.js - handles distributor assignments over all territories

 */



/*global $ Option document Querystring OTHER_DISTRIBUTOR  */



/**

 * This function is called via the change event of the reseller dropdown.

 * It is also called initially when a new distributor list is loaded.

 * This function will copy the referrer code associated with the reseller to the

 * referrer code form field.

 */

function applyDistributor() {

    var distributorsBox = $("#distributor_choice").get(0);

    var referrerCodeEdit = $("#referrer_code").get(0);

    referrerCodeEdit.value = distributorsBox.options[distributorsBox.selectedIndex].value;

}



/**

 * This function is called when the webservice call completes.

 *

 * It will show the list of available distributors. The 'other' distributor

 * will be selected first. For countries without a distributor, the dropdown

 * box is hidden.

 */

function showDistributorList(distributors) {

    var distributorsBox = $("#distributor_choice").get(0);

    var referrerCodeEdit = $("#referrer_code").get(0);

    // handle empty list in reply

    if ((distributors === undefined) || (distributors.length === 0)) {

        // hide the distributor box and show the referrer code box,

        $("#distributor_choice_div").hide();

        $("#referrer_code_div").show();

        distributorsBox.value = 0;

        referrerCodeEdit.value = '';

    } else {

        // a single distributor for a country

        if (distributors.length == 1) {

            // don't show distributor list

            $("#referrer_code_div").hide();

            $("#distributor_choice_div").hide();

        } else {

            // for >1 distributor, show distributor list

            $("#distributor_choice_div").show();

            $("#referrer_code_div").hide();

        }

        // remove all previous dropdown box options

        distributorsBox.options.length = 0;

        // fill with options from the distributor list

        for ( var distributorIndex = 0; distributorIndex < distributors.length; distributorIndex++ ) {

            //alert(distributors.length);

            distributorsBox.options[distributorIndex] = new Option(

                distributors[distributorIndex][0],	// label

                distributors[distributorIndex][1]);	// value

        }

        var oQry = new Querystring();

        var referrerCode = oQry.get( 'referrer_code', '');

        if (referrerCode !== '') {

            // if this form is recalled after an error, referrer_code is set in the query string

            // in this case re-select the previously selected distributor

            distributorsBox.value = referrerCode;

        } else {

            // otherwise select "other" variant

            // need to set via .selectedIndex, not .value, because referrer codes

            // are not unique

            distributorsBox.selectedIndex = distributors.length - 1;

            distributorsBox.options[distributorsBox.selectedIndex].text = OTHER_DISTRIBUTOR;

        }

        applyDistributor();

    }

}



/**

 * This function will update the list of available distributors for the

 * selected country and language. The showDistributorsList() will

 * handle the display one the query is completed.

 */

function refreshDistributorList() {

    var countryBox = $("#country").get(0);

    var countryCode = countryBox.options[countryBox.selectedIndex].value;

    // clear distributor selection

    var distributorsBox = $("#distributor_choice").get(0);

    var referrerCodeEdit = $("#referrer_code").get(0);

    distributorsBox.value = 0;

    referrerCodeEdit.value = '';

    // remove all previous dropdown box options

    distributorsBox.options.length = 0;

    // determine country and language code

    var languageChoice = $("#language_choice").get(0);

    var languageCode = languageChoice.value;



    Array.prototype.chooseRandom = function() {

        return this[Math.floor(Math.random() * this.length)];

    };



    var distributorsListing = new Array();

    var distributorsRandom = new Array();



    switch(countryCode) {

        case "afr":

        case "za":

            $africasd = "RSLR4HD22";

            distributorsListing[0] = ["Africa SD",$africasd];

            break;

        case "ar":

        case "bo":

        case "cl":

        case "co":

        case "do":

        case "ec":

        case "mx":

        case "py":

        case "pe":

        case "pr":

        case "uy":

        case "ve":

            $maxfocuslatam = "RSLR4HD99";

            distributorsListing[0] = ["MAXfocus LATAM",$maxfocuslatam];

            break;

        case "az":

        case "by":

        case "ge":

        case "kg":

        case "md":

        case "ru":

        case "tj":

        case "tm":

        case "ua":

        case "uz":

            $controlline = "RSLR4HD41";

            distributorsListing[0] = ["Control Line",$controlline];

            break;

        case "by":

        case "lux":

        case "nl":

            $logicnowblx = "RSLR4HD47";

            distributorsListing[0] = ["LogicNow BENELUX",$logicnowblx];

            break;

        case "dkb":

        case "dk":

        case "fo":

        case "gl":

            $incom = "RSLR4HD11";

            distributorsListing[0] = ["Incom Dk ApS",$incom];

            break;

        case "ba":

        case "hr":

        case "rs":

            $nestec = "RSLR4HD40";

            distributorsListing[0] = ["Nestec d.o.o.",$nestec];

            break;

        case "br":

            $maxfocusbrazil = "RSLR4HD122";

            distributorsListing[0] = ["MAXfocus Brazil",$maxfocusbrazil];

            break;

        case "bg":

            $dsb = "RSLR4HD9";

            distributorsListing[0] = ["Business Software Distributor Ltd.",$dsb];

            break;

        case "cy":

        case "gr":

            $orth = "RSLR4HD44";

            distributorsListing[0] = ["ORTHOLOGY Business Software & IT Services.",$orth];

            break;

        case "ee":

        case "hu":

            $altacom = "RSLR4HD18";

            distributorsListing[0] = ["Altacom Ltd.",$altacom];

            break;

        case "fi":

        case "lv":

        case "lt":

            $biztrib = "RSLR4HD39";

            distributorsListing[0] = ["Biztributor",$biztrib];

            break;

        case "il":

            $mpoint = "RSLR4HD37";

            distributorsListing[0] = ["Multipoint",$mpoint];

            break;

        case "no":

            $intranet = "RSLR4HD12";

            distributorsListing[0] = ["Intranet Distribusjon",$intranet];

            break;

        case "pa":

            $inzpire = "RSLR4HD137";

            distributorsListing[0] = ["InzpireSoft",$inzpire];

            break;

        case "pl":

            $edr = "RSLR4HD42";

            distributorsListing[0] = ["ed&r Polska Sp. z o.o.",$edr];

            break;

        case "ro":

            $romsyn = "RSLR4HD10";

            distributorsListing[0] = ["Romsym Data SRL",$romsyn];

            break;

        case "sk":

            $pbcom = "RSLR4HD7";

            distributorsListing[0] = ["PB Com spol. sÃƒâ€šÃ‚ r.o.",$pbcom];

            break;

        case "si":

            $trend = "RSLR4HD43";

            distributorsListing[0] = ["ORG. TEND",$trend];

            break;

        case "se":

            $communica = "RSLR4HD21";

            distributorsListing[0] = ["Communica",$communica];

            break;

        case "fr":

            $aubelio = "RSLR4HD11";

            $watsoft = "RSLR4HD18";

            distributorsRandom = [$aubelio,$watsoft];

            distributorsListing[0] = ["Aubelio",$aubelio];

            distributorsListing[1] = ["Watsoft",$watsoft];

            distributorsListing[2] = ["No Preferences",distributorsRandom.chooseRandom()];

            break;

        case "it":

            $cips = "RSLR4HD26";

            $ready = "RSLR4HD31";

            distributorsRandom = [$cips,$ready];

            distributorsListing[0] = ["CIPS SNC",$cips];

            distributorsListing[1] = ["Ready Informatica SRL",$ready];

            distributorsListing[2] = ["No Preferences",distributorsRandom.chooseRandom()];

            break;

        case "de":

            $acmeo = "RSLR4HD7";

            $adn = "RSLR4HD5";

            $also = "RSLR4HD9";

            distributorsRandom = [$acmeo,$adn,$also];

            distributorsListing[0] = ["acmeo cloud-distribution GmbH & Co. KG",$acmeo];

            distributorsListing[1] = ["ADN Advanced Digital Network Distribution GmbH (Germany)",$adn];

            distributorsListing[2] = ["ALSO Deutschland GmbH",$also];

            distributorsListing[3] = ["No Preferences",distributorsRandom.chooseRandom()];

            break;

        case "au":

            $acmeo = "RSLR4HD7";

            $nestec = "RSLR4HD4";

            $adn = "RSLR4HD8";

            distributorsRandom = [$acmeo,$adn,$nestec];

            distributorsListing[0] = ["acmeo cloud-distribution GmbH & Co. KG",$acmeo];

            distributorsListing[1] = ["ADN Advanced Digital Network Distribution GmbH (Austria)",$adn];

            distributorsListing[2] = ["NESTEC Scharf IT-Solutions OG",$nestec];

            distributorsListing[3] = ["No Preferences",distributorsRandom.chooseRandom()];

            break;

        case "ch":

            if (languageCode == "de"){

                $acmeo = "RSLR4HD7";

                $netpoint = "RSLR4HD6";

                distributorsRandom = [$acmeo,$netpoint];

                distributorsListing[0] = ["acmeo cloud-distribution GmbH & Co. KG",$acmeo];

                distributorsListing[1] = ["net-point ag",$netpoint];

                distributorsListing[2] = ["No Preferences",distributorsRandom.chooseRandom()];

                break;

            }

            if (languageCode == "en"){

                $netpoint = "RSLR4HD23";

                distributorsListing[0] = ["net-point ag",$netpoint];

                break;

            }

            if (languageCode == "fr"){

                $aubelio = "RSLR4HD11";

                distributorsListing[0] = ["Aubelio",$aubelio];

                break;

            }

        case "es":

        case "pt":

            $admtools = "RSLR4HD14";

            distributorsListing[0] = ["admtools",$admtools];

            break;

        default:

    }





    showDistributorList(distributorsListing);



}



$(document).ready(function() {

    // fetch new list when language was changed

    $("#language_choice").change(function() {

        refreshDistributorList();

    });

    // apply when distributor was selected

    $("#distributor_choice").change(function() {

        applyDistributor();

    });

});