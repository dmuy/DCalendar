/* -- DO NOT REMOVE --
 * jQuery DCalendar 2.0 and DCalendar Picker 2.0 plugin
 * 
 * Author: Dionlee Uy
 * Email: dionleeuy@gmail.com
 *
 * Date: Thursday, May 12 2016
 *
 * @requires jQuery
 * -- DO NOT REMOVE --
 */
if (typeof jQuery === 'undefined') { throw new Error('DCalendar.Picker: This plugin requires jQuery'); }
+function ($) {

	Date.prototype.getDays = function() { return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate(); };

	var months = ['January','February','March','April','May','June','July','August','September','October','November','December'],
		short_months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
		daysofweek = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
		short_days = ['Sun','Mon','Tues','Wed','Thu','Fri','Sat'],
		ex_keys = [9,112,113,114,115,116,117,118,119,120,121,122,123],

		DCalendar = function(elem, options) {
			this.elem = $(elem);
			this.options = options;
			this.calendar = null;		//calendar container
			this.today = new Date();	//current date

			//current selected date, default is today if no value given
			if(this.elem.val() === '') {
				this.date = new Date();
			} else {
				var dateObj = this.reformatDate(this.elem.val());
				this.date = isNaN(parseInt(dateObj.m)) ? new Date(dateObj.m + " " + dateObj.d + ", " + dateObj.y) : new Date(dateObj.y, dateObj.m - 1, dateObj.d);
			}
			this.viewMode = 'days';
			this.minDate = this.elem.data('mindate');
			this.maxDate = this.elem.data('maxdate');
			
			this.selected = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
			
			var that = this;

			this.create(this.viewMode);

			this.calendar.find('.calendar-head-card .calendar-date-wrapper').click(function () {
				that.selected = new Date(that.today.getFullYear(), that.today.getMonth(), that.today.getDate());

				//Trigger select event
				that.selectDate();
				that.selectedView();
			});
			this.calendar.find('.calendar-prev').click(function () { that.getNewMonth('left', true); });
			this.calendar.find('.calendar-next').click(function () { that.getNewMonth('right', true); });
			this.calendar.find('.calendar-curr-month').click(function () { that.getMonths(); });
		    this.calendar.find('.calendar-date-holder').on('click', '.calendar-dates .date:not(.date.month) a', function () {
		    	var span = $(this).parent();
		        if (span.hasClass('disabled')) return;
				that.calendar.find('.calendar-dates .date').removeClass('selected');
				span.addClass('selected');
				var day = parseInt($(this).text()),
					plus = span.hasClass('pm') ? -1 : span.hasClass('nm') ? 1 : 0;
				that.selected = new Date(that.date.getFullYear(), that.date.getMonth() + plus, day);
				
				//Trigger select event
				that.selectDate();
			}).on('click', '.calendar-dates .date.month a', function () {
				var selMonth = parseInt($(this).parent().attr('data-month'));
				that.viewMode = 'days';
				that.date.setMonth(selMonth);
				that.getNewMonth(null, false);
			});

			this.getNewMonth(null, false);
		};

	DCalendar.prototype = {
		constructor : DCalendar,
		/* Parses date string using default or specified format. */
		reformatDate : function (date) {
			var that = this,
				format = that.options.format,
				dayLength = (format.match(/d/g) || []).length,
				monthLength = (format.match(/m/g) || []).length,
				yearLength = (format.match(/y/g) || []).length,
				isFullMonth = monthLength == 4,
				isMonthNoPadding = monthLength == 1,
				isDayNoPadding = dayLength == 1,
				lastIndex = date.length,
				firstM = format.indexOf('m'), firstD = format.indexOf('d'), firstY = format.indexOf('y'),
				month = '', day = '', year = '';

			// Get month on given date string using the format (default or specified)
			if(isFullMonth) {
				var monthIndex = -1;
				$.each(months, function (i, month) { if (date.indexOf(month) >= 0) monthIndex = i; });
				month = months[monthIndex];
				format = format.replace('mmmm', month);
				firstD = format.indexOf('d');
				firstY = format.indexOf('y');
			} else if (!isDayNoPadding && !isMonthNoPadding || (isDayNoPadding && !isMonthNoPadding && firstM < firstD)) {
				month = date.substr(firstM, monthLength);
			} else {
				var lastIndexM = format.lastIndexOf('m'),
					before = format.substring(firstM - 1, firstM),
					after = format.substring(lastIndexM + 1, lastIndexM + 2);

				if (lastIndexM == format.length - 1) {
					month = date.substring(date.indexOf(before, firstM - 1) + 1, lastIndex);
				} else if (firstM == 0) {
					month = date.substring(0, date.indexOf(after, firstM));
				} else {
					console.log(date.indexOf(after, firstM));
					month = date.substring(date.indexOf(before, firstM - 1) + 1, date.indexOf(after, firstM + 1));
				}
			}

			// Get date on given date string using the format (default or specified)
			if (!isDayNoPadding && !isMonthNoPadding || (!isDayNoPadding && isMonthNoPadding && firstD < firstM)) {
				day = date.substr(firstD, dayLength);
			} else {
				var lastIndexD = format.lastIndexOf('d');
					before = format.substring(firstD - 1, firstD),
					after = format.substring(lastIndexD + 1, lastIndexD + 2);

				if (lastIndexD == format.length - 1) {
					day = date.substring(date.indexOf(before, firstD - 1) + 1, lastIndex);
				} else if (firstD == 0) {
					day = date.substring(0, date.indexOf(after, firstD));
				} else {
					day = date.substring(date.indexOf(before, firstD - 1) + 1, date.indexOf(after, firstD + 1));
				}
			}

			// Get year on given date string using the format (default or specified)
			if (!isMonthNoPadding && !isDayNoPadding || (isMonthNoPadding && isDayNoPadding && firstY < firstM && firstY < firstD)
				|| (!isMonthNoPadding && isDayNoPadding && firstY < firstD) || (isMonthNoPadding && !isDayNoPadding && firstY < firstM)) {
				year = date.substr(firstY, yearLength);
			} else {
				var before = format.substring(firstY - 1, firstY);
				year = date.substr(date.indexOf(before, firstY - 1) + 1, yearLength);
			}

			return { m: month, d: day, y: year };
		},
		/* Returns formatted string representation of selected date */
		formatDate : function (format) {
			var d = new Date(this.selected), day = d.getDate(), m = d.getMonth(), y = d.getFullYear();
			return format.replace(/(yyyy|yy|mmmm|mmm|mm|m|dd|d)/gi, function (e) {
				switch(e.toLowerCase()){
					case 'd': return day;
					case 'dd': return (day < 10 ? "0"+day: day);
					case 'm': return m+1;
					case 'mm': return (m+1 < 10 ? "0"+(m+1): (m+1));
					case 'mmm': return short_months[m];
					case 'mmmm': return months[m];
					case 'yy': return y.toString().substr(2,2);
					case 'yyyy': return y;
				}
			});
		},
		/* Selects date and trigger event (for other actions - if specified) */
		selectDate : function () {
			var that = this,
				newDate = that.formatDate(that.options.format),
				e = $.Event('dateselected', {date: newDate});

			that.elem.trigger(e);
		},
		/* Gets list of months (for month view) */
		getMonths : function () {
			var that = this,
				currentYear = that.today.getFullYear(),
				currentMonth = that.today.getMonth();

			if(that.viewMode !== 'days') return;
			var cal = that.calendar;
				curr = cal.find('.calendar-dates'),
				dayLabel = cal.find('.calendar-labels'),
				currMonth = cal.find('.calendar-curr-month'),
				container = cal.find('.calendar-date-holder'),
				cElem = curr.clone(),
				rows = [],
				cells = [],
				count = 0;

			that.viewMode = 'months';
			currMonth.text(that.date.getFullYear());
			dayLabel.addClass('invis');
			for (var i = 1; i < 4; i++) {
				var row = [$("<span class='date month'></span>"),
							$("<span class='date month'></span>"),
							$("<span class='date month'></span>"),
							$("<span class='date month'></span>")];
				for (var a = 0; a < 4; a++) {
					row[a].html("<a href='javascript:void(0);'>" + short_months[count] + "</a>").attr('data-month', count);
					count++;
				}
				rows.push(row);
			}
			$.each(rows, function(i, v){
			    var row = $('<span class="cal-row"></span>'), l = v.length;
				for(var i = 0; i < l; i++) { row.append(v[i]); }
				cells.push(row);
			});
			container.parent().height(container.parent().outerHeight(true));
			cElem.empty().append(cells).addClass('months load').appendTo(container);
			curr.addClass('hasmonths');
			setTimeout(function () { cElem.removeClass('load'); }, 0);
			setTimeout(function () { curr.remove(); }, 300);
		},
		/* Gets days for month of 'newDate'*/
		getDays : function (newDate, callback) {
		    var that = this,
				ndate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()),
				today = new Date(that.today.getFullYear(), that.today.getMonth(), that.today.getDate()),
                min = that.minDate === "today" ? today : new Date(that.minDate),
                max = that.maxDate === "today" ? today : new Date(that.maxDate),
				days = ndate.getDays(),
				day = 1,
		        d = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate()),
				nStartDate = 1,
				rows = [],
				dates = [];

			for(var i = 1; i <= 6; i++){
				var week = [$('<span class="date"></span>'),
							$('<span class="date"></span>'),
							$('<span class="date"></span>'),
							$('<span class="date"></span>'),
							$('<span class="date"></span>'),
							$('<span class="date"></span>'),
							$('<span class="date"></span>')];

				while(day <= days) {
					d.setDate(day);
					var dayOfWeek = d.getDay();

					if (d.getTime() == today.getTime()) week[dayOfWeek].addClass('current');
                    
                    if ((that.minDate && d < min) || (that.maxDate && d > max)) week[dayOfWeek].addClass('disabled');

					if(i === 1 && dayOfWeek === 0){
						break;
					} else if (dayOfWeek < 6) {
					    //console.log(that.selected);
					    if (d.getTime() == that.selected.getTime()) week[dayOfWeek].addClass('selected');

						week[dayOfWeek].html('<a href="javascript:void(0);">' + (day++) + '</a>');
					} else {
					    if (d.getTime() == that.selected.getTime()) week[dayOfWeek].addClass('selected');

						week[dayOfWeek].html('<a href="javascript:void(0);">' + (day++) + '</a>');
						break;
					}
				}
				/* For days of previous and next month */
				if (i === 1 || i > 4) {
					// First week
				    if (i === 1) {
				        var pmonth = new Date(newDate.getFullYear(), newDate.getMonth() - 1, 1);
				        var pMonth = pmonth.getMonth(), pDays = 0;
				        pDays = pmonth.getDays();
						for (var a = 6; a >= 0; a--) {
						    if (week[a].text() !== '') continue;

						    pmonth.setDate(pDays);
						    week[a].html('<a href="javascript:void(0);">' + (pDays--) + '</a>').addClass('pm');

							if ((that.minDate && pmonth < min) || (that.maxDate && pmonth > max)) week[a].addClass('disabled');

							if (pmonth.getTime() == that.selected.getTime()) week[a].addClass('selected');
						}
					} 
					// Last week
					else if (i > 4) {
					    var nmonth = new Date(d.getFullYear(), d.getMonth() + 1, 1);
						for (var a = 0; a <= 6; a++) {
						    if (week[a].text() !== '') continue;

						    nmonth.setDate(nStartDate);
						    week[a].html('<a href="javascript:void(0);">' + (nStartDate++) + '</a>').addClass('nm');

							if ((that.minDate && nmonth < min) || (that.maxDate && nmonth > max)) week[a].addClass('disabled');

							if (nmonth.getTime() == that.selected.getTime()) week[a].addClass('selected');
						}
					}
				}
				rows.push(week);
			}
			$.each(rows, function(i, v){
				var row = $('<span class="cal-row"></span>'), l = v.length;
				for(var i = 0; i < l; i++) { row.append(v[i]); }
				dates.push(row);
			});
			callback(dates);
		},
		/* Sets current view based on user interaction (on arrows) */
		getNewMonth : function (dir, isTrigger) {
			var that = this,
				cal = that.calendar;
				curr = cal.find('.calendar-dates:not(.left):not(.right)'),
				lblTodayDay = cal.find('.calendar-dayofweek'),
				lblTodayMonth = cal.find('.calendar-month'),
				lblTodayDate = cal.find('.calendar-date'),
				lblTodayYear = cal.find('.calendar-year'),
				lblMonth = cal.find('.calendar-curr-month'),
				container = cal.find('.calendar-date-holder');

			if (that.viewMode === 'days') {
				if (isTrigger) {
					that.date.setDate(1);
					that.date.setMonth(that.date.getMonth() + ( dir === 'right' ? 1 : -1));
				}
				that.getDays(that.date, function (dates) {
					if (isTrigger) {
						var cElem = curr.clone();
						cElem.addClass(dir).empty().append(dates)[dir == 'left' ? 'prependTo' : 'appendTo'](container);
						setTimeout(function() {
							curr.addClass(dir == 'left' ? 'right' : 'left');
							cElem.removeClass(dir);
							setTimeout(function () { cal.find('.calendar-dates.'+(dir == 'left' ? 'right' : 'left')+'').remove(); }, 300);
						}, 0);
					} else {
						if (curr.hasClass('months')) {
							var cElem = curr.clone();
							$('.calendar-labels').removeClass('invis');
							cElem.empty().append(dates).addClass('hasmonths').appendTo(container);
							curr.addClass('load');
							setTimeout(function () { cElem.removeClass('hasmonths'); }, 0);
							container.parent().removeAttr('style');
							setTimeout(function () {
								cElem.removeClass('months');
								setTimeout(function () { cal.find('.calendar-dates.months').remove(); }, 300);
							}, 0);
						} else {
							curr.append(dates);
						}
					}
				});
				
				lblMonth.text(months[that.date.getMonth()] + ' ' + that.date.getFullYear());
				
				if (!isTrigger && !curr.hasClass('months')) {
					lblTodayDay.text(short_days[that.today.getDay()]);
					lblTodayMonth.text(short_months[that.today.getMonth()]);
					lblTodayDate.text(that.today.getDate());
					lblTodayYear.text(that.today.getFullYear());
				}
			} else {
				that.date.setYear(that.date.getFullYear() + ( dir === 'right' ? 1 : -1))
				lblMonth.text(that.date.getFullYear());
			}
		},
		/* Sets current view to selected date */
		selectedView : function () {
			var that = this,
				cal = that.calendar;
				curr = cal.find('.calendar-dates:eq(0)'),
				lblMonth = cal.find('.calendar-curr-month'),
				lblDays = cal.find('.calendar-labels');

			that.getDays(that.selected, function (dates) {
				curr.html(dates);
			});

			lblMonth.text(months[that.selected.getMonth()] + ' ' + that.selected.getFullYear());
			lblDays.removeClass('invis');
			that.viewMode = 'days';
		},
		/* Creates components for the calendar */
		create : function(){
			var that = this,
				mode = that.options.mode,
				overlay = $('<div class="calendar-overlay"></div>'),
				wrapper = $('<div class="calendar-wrapper load"></div>'),
				cardhead = $('<section class="calendar-head-card"><span class="calendar-year"></span><span class="calendar-date-wrapper" title="Select current date."><span class="calendar-dayofweek"></span>, <span class="calendar-month"></span> <span class="calendar-date"></span></span></section>'),
				container = $('<div class="calendar-container"></div>'),
				calhead = $('<section class="calendar-top-selector"><span class="calendar-prev">&lsaquo;</span><span class="calendar-curr-month"></span><span class="calendar-next">&rsaquo;</span></section>'),
				datesgrid = $('<section class="calendar-grid">'
							// + '<div class="calendar-labels"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>'
							+ '<div class="calendar-labels"><span>Su</span><span>Mo</span><span>Tu</span><span>We</span><span>Th</span><span>Fr</span><span>Sa</span></div>'
							+ '<div class="calendar-date-holder"><section class="calendar-dates"></section></div></section>');

			calhead.appendTo(container);
			datesgrid.appendTo(container);

			overlay.click(function (e) { that.hide(); });
			wrapper.click(function (e) { e.stopPropagation(); });

			wrapper.append(cardhead).append(container).appendTo(mode === 'calendar' ? that.elem : overlay);
			that.calendar = mode === 'calendar' ? that.elem : wrapper;

			if(mode !== 'calendar') { 
				wrapper.addClass('picker');
				overlay.appendTo('body');
			}
		},
		/* Shows the calendar (date picker) */
		show : function () {
			this.date = new Date(this.selected.getFullYear(), this.selected.getMonth(), this.selected.getDate());
			this.selectedView();
			this.calendar.parent().fadeIn('fast');
			this.calendar.removeClass('load');
		},
		/* Hides the calendar (date picker) */
		hide : function (callback) {
			var that = this;
			that.calendar.addClass('load');
			that.calendar.parent().fadeOut(function () {
				// that.calendar.parent().remove();
				if(callback) callback();
				if(that.elem.is('input')) that.elem.focus();
			});
		}
	};

	/* DEFINITION FOR DCALENDAR */
	$.fn.dcalendar = function(opts){
		return $(this).each(function(index, elem){
			var that = this;
 			var $this = $(that),
 				data = $(that).data('dcalendar'),
 				options = $.extend({}, $.fn.dcalendar.defaults, $this.data(), typeof opts === 'object' && opts);
 			if(!data){
 				$this.data('dcalendar', (data = new DCalendar(this, options)));
 			}
 			if(typeof opts === 'string') data[opts]();
		});
	};

	$.fn.dcalendar.defaults = {
		mode : 'calendar',
		format: 'mm/dd/yyyy',
	};

	$.fn.dcalendar.Constructor = DCalendar;

	/* DEFINITION FOR DCALENDAR PICKER */
	$.fn.dcalendarpicker = function(opts){
		return $(this).each(function(){
			var that = $(this);

			if(opts){
				opts.mode = 'datepicker';
				that.dcalendar(opts);
			} else{
				that.dcalendar({mode: 'datepicker'});
			}

			that.on('click', function (e) {
				var cal = that.data('dcalendar');
				cal.show();
				this.blur();
			}).on('dateselected', function (e) {
				var cal = that.data('dcalendar');
				that.val(e.date).trigger('onchange');
				cal.hide(function () {
					that.trigger($.Event('datechanged', {date: e.date}));
				});				
			}).on('keydown', function(e){
				if(ex_keys.indexOf(e.which) < 0) return false; 
			});
			$(document).on('keydown', function (e) {
				if(e.keyCode != 27) return;
				that.data('dcalendar').hide();
			});
		});
	};
}(jQuery);