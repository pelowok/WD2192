/*!

Badgeville JS SDK Preconfigured Visualizations
Version 1.3.6

Copyright 2014 Badgeville, Inc.

Licensed under Badgeville's Free Software License Agreement (the "License"); you may not use this file except
in compliance with the License. You may obtain a copy of the License at http://source.badgeville.com/license
Unless required by applicable law or mutually agreed to in writing, software distributed under the License is 
distributed on an "AS-IS" BASIS, WITHOUT WARRANTIES, COMMITMENTS OR LIABILITY OF ANY KIND, either express or 
implied. See the License for the specific language governing rights, permissions, restrictions and limitations 
under the License.

*/

var BVVIZ = {};

;(function($) {
BVVIZ = {

  // Default options to initialize individual visualization component
  options: {
  },

  // Common helper methods
  helper: {

    // Convert a timestamp into a normalized date display
    timeToFormatted: function( timestamp, formatMask ) {
      // Set the default BVVIZ date format mask
      formatMask = $.type( formatMask ) === 'string' ? formatMask : 'mm/dd/yyyy HH:MMTT';
      // convert UTC value into a formatted date display
      return BVVIZ.dateFormat ( new Date( BVVIZ.utility.parseDateString( timestamp ) ), formatMask );
    },
  },


  // BVVIZ utility functions
  utility: {

    /*
    * Convert the server date string to javascript epoch value * 1000
    * 2015-03-13T23:22:44Z
    * 2015-2-13T00:00:00.000Z
    * 2015-02-13T00:00:00.000-08:00
    * 2013-11-01T00:00:00.000-07:00 
    */
    parseDateString: function( dStr ) {

      var eVal = 0,   // number of milseconds have elapsed since Jan 1, 1970
          tOffset,  // timezone offset
          milSecPerHour = 60 * 60 * 1000,   // milseconds per hour
          arr = /^\s*(\d{4})\-(\d{1,2})\-(\d{1,2})T(\d{2}):(\d{2}):(\d{2})\.?(\d{3})?Z?((\-)(\d{2}):(\d{2}))?\s*$/.exec(dStr) ;

      if ( $.isArray(arr) ){

        eVal = Date.UTC(arr[1],--arr[2],+arr[3],+arr[4]||0,+arr[5]||0,+arr[6]||0);

        tOffset = parseInt(arr[10], 10);

        // adjust the timezone offset value
        if ( tOffset > 0 ) {
          if ( arr[9] === '-' ) {
            eVal += milSecPerHour * tOffset;
          } else {
            eVal -= milSecPerHour * tOffset;
          }
        }
      
      } else if ( $.type( dStr) === 'date' ) {
        eVal = dStr.getTime();

      } else if ( $.type( dStr) === 'string' ) {
        arr = dStr.split( '-' );
        eVal = Date.UTC( arr[0], parseInt(arr[1]) - 1, arr[2].split('T')[0] );
        
        //console.log("<parseDate> "+dStr+"   "+parseInt(mo+1)+"/"+day+"/"+yr+"  ... "+eVal);
      }

      return eVal;
    },

    // Function to automate relative time updates
    timestampRunner: {
      options: {
        minLen: 10000,
        maxLen: 60000,
        scaleRate: .5
      }, 
      job: null,
      time: null,
      timeoutLen: null,
      schedule: function( timestamp ) {
        var now = new Date().getTime(),
            timeoutLen,
            newTime;
        //determine timeout length
        if ( timestamp ) {
          //base on new action
          timeoutLen = now - new Date( BVVIZ.utility.parseDateString( timestamp ) ).getTime();
        } else {
          //base on last action/job and handle scaleing
          timeoutLen = this.timeoutLen + Math.floor( this.timeoutLen * this.options.scaleRate );
        }
        //handle limits
        timeoutLen = timeoutLen < this.options.minLen ? this.options.minLen : ( timeoutLen > this.options.maxLen ? this.options.maxLen : timeoutLen );
        if ( isNaN( timeoutLen ) ) {
          return false;
        }
        //determine to schedule job
        newTime = now + timeoutLen;
        if ( this.job == null || newTime < this.time ) {
          if ( this.job != null ) {
            window.clearTimeout( this.job );
          }
          this.job = window.setTimeout( function (){
            $( '.bvviz-timestamp' ).trigger( 'bvviz.timestamp' );
            BVVIZ.utility.timestampRunner.job = null;
            BVVIZ.utility.timestampRunner.schedule( false );
          }, timeoutLen );
          this.time = newTime;
          this.timeoutLen = timeoutLen;
          return true;
        }
        return false;
      }
    }

  },


  /*
  * Date Format 1.2.3
  * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
  * MIT license
  *
  * Includes enhancements by Scott Trenda <scott.trenda.net>
  * and Kris Kowal <cixar.com/~kris.kowal/>
  *
  * Accepts a date, a mask, or a date and a mask.
  * Returns a formatted version of the given date.
  * The date defaults to the current date/time.
  * The mask defaults to dateFormatMasks.default.
  *
  * The dateFormat function is used by function timeToFormatted(), it has been modified to avoid namespace conflict
  */
  dateFormat: function () {
      var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
      timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
      timezoneClip = /[^-+\dA-Z]/g,
      pad = function (val, len) {
          val = String(val);
          len = len || 2;
          while (val.length < len) val = "0" + val;
          return val;
      };

      // Regexes and supporting functions are cached through closure
      return function (date, mask, utc) {
          var dF = BVVIZ.dateFormat;

          // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
          if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
              mask = date;
              date = undefined;
          }

          // Passing date through Date applies Date.parse, if necessary
          date = date ? new Date(date) : new Date;
          if (isNaN(date)) throw SyntaxError("invalid date");

          mask = String(BVVIZ.dateFormatMasks[mask] || mask || BVVIZ.dateFormatMasks["default"]);

          // Allow setting the utc argument via the mask
          if (mask.slice(0, 4) == "UTC:") {
              mask = mask.slice(4);
              utc = true;
          }

          var _ = utc ? "getUTC" : "get",
        d = date[_ + "Date"](),
        D = date[_ + "Day"](),
        m = date[_ + "Month"](),
        y = date[_ + "FullYear"](),
        H = date[_ + "Hours"](),
        M = date[_ + "Minutes"](),
        s = date[_ + "Seconds"](),
        L = date[_ + "Milliseconds"](),
        o = utc ? 0 : date.getTimezoneOffset(),
        flags = {
            d: d,
            dd: pad(d),
            ddd: BVVIZ.dateFormati18n.dayNames[D],
            dddd: BVVIZ.dateFormati18n.dayNames[D + 7],
            m: m + 1,
            mm: pad(m + 1),
            mmm: BVVIZ.dateFormati18n.monthNames[m],
            mmmm: BVVIZ.dateFormati18n.monthNames[m + 12],
            yy: String(y).slice(2),
            yyyy: y,
            h: H % 12 || 12,
            hh: pad(H % 12 || 12),
            H: H,
            HH: pad(H),
            M: M,
            MM: pad(M),
            s: s,
            ss: pad(s),
            l: pad(L, 3),
            L: pad(L > 99 ? Math.round(L / 10) : L),
            t: H < 12 ? "a" : "p",
            tt: H < 12 ? "am" : "pm",
            T: H < 12 ? "A" : "P",
            TT: H < 12 ? "AM" : "PM",
            Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
            o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
            S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
        };

          return mask.replace(token, function ($0) {
              return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
          });
      };
  }(),

  // Some common format strings for dateFormat
  dateFormatMasks : {
      "default": "ddd mmm dd yyyy HH:MM:ss",
      shortDate: "m/d/yy",
      mediumDate: "mmm d, yyyy",
      longDate: "mmmm d, yyyy",
      fullDate: "dddd, mmmm d, yyyy",
      shortTime: "h:MM TT",
      mediumTime: "h:MM:ss TT",
      longTime: "h:MM:ss TT Z",
      isoDate: "yyyy-mm-dd",
      isoTime: "HH:MM:ss",
      isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
      isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
  },

  // Internationalization strings for dateFormat
  dateFormati18n : {
      dayNames: [
      "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ],
      monthNames: [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
      "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
    ]
  }

};
})(jQuery); 