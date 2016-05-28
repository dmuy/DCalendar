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
		ex_keys = [9,112,113,114,115,116,117,118,119,120,121,122,123],

		DCalendar = function(elem, options) {
			this.elem = $(elem);
			this.calendar = null;		//calendar container
			this.today = new Date();	//current date
			this.date = this.elem.val() === '' ? new Date() : new Date(this.elem.val());	//current selected date, default is today if no value given
			this.viewMode = 'days';
			this.options = options;
			
			this.selected = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
			
			var that = this;

			this.create(this.viewMode);

			this.calendar.find('.calendar-prev').click(function () { that.getNewMonth('left', true); });
			this.calendar.find('.calendar-next').click(function () { that.getNewMonth('right', true); });
			this.calendar.find('.calendar-curr-month').click(function () {
				that.getMonths();
			});
			this.calendar.find('.calendar-date-holder').on('click', '.calendar-dates .date:not(.date.month)', function () {
				that.calendar.find('.calendar-dates .date').removeClass('selected');
				$(this).addClass('selected');
				var day = parseInt($(this).find('a').text()),
					plus = $(this).hasClass('pm') ? -1 : $(this).hasClass('nm') ? 1 : 0;
				that.selected = new Date(that.date.getFullYear(), that.date.getMonth() + plus, day);
				
				//Trigger select event
				that.calendar.trigger($.Event('dateselected', {date: that.formatDate(that.options.format)}));
			}).on('click', '.calendar-dates .date.pm', function () {
				that.getNewMonth('left', true);
			}).on('click', '.calendar-dates .date.nm', function () {
				that.getNewMonth('right', true);
			}).on('click', '.calendar-dates .date.month', function () {
				var selMonth = parseInt($(this).attr('data-month'));
				that.viewMode = 'days';
				that.date.setMonth(selMonth);
				that.getNewMonth(null, false);
			});

			this.getNewMonth(null, false);
		};

	DCalendar.prototype = {
		constructor : DCalendar,
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
		cleanUp : function (toRemove, currElem, cssClass) {
			setTimeout(function () {
				currElem.removeClass(cssClass);
				toRemove.remove();
			}, 250);
		},
		getMonths : function () {
			var that = this;
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
			// dayLabel.hide();
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
			setTimeout(function () {
				curr.remove();
				currMonth.text(that.date.getFullYear());
			}, 250);
		},
		getDays : function (newDate, cb) {
			var that = this,
				ndate = new Date(newDate),
				today = that.today,
				days = ndate.getDays(),
				day = 1;
				d = new Date(newDate),
				nStartDate = 1;
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
					if(day === today.getDate() 
						&& d.getMonth() === today.getMonth() 
						&& d.getFullYear() === today.getFullYear()) {
						week[dayOfWeek].addClass('current');
					}

					if(i === 1 && dayOfWeek === 0){
						break;
					} else if (dayOfWeek < 6) {
					    if (day === that.selected.getDate()
						&& d.getMonth() === that.selected.getMonth()
						&& d.getFullYear() === that.selected.getFullYear()) {
					        week[dayOfWeek].addClass('selected');
					    }
						week[dayOfWeek].html('<a href="javascript:void(0);">' + (day++) + '</a>');
					} else {
					    if (day === that.selected.getDate()
						&& d.getMonth() === that.selected.getMonth()
						&& d.getFullYear() === that.selected.getFullYear()) {
					        week[dayOfWeek].addClass('selected');
					    }
						week[dayOfWeek].html('<a href="javascript:void(0);">' + (day++) + '</a>');
						break;
					}
				}
				/* For days of previous and next month */
				if (i === 1 || i > 4) {
					var p = new Date(newDate);
					// First week
					if (i === 1) {
						var pMonth = p.getMonth(), pDays = 0;
						p.setDate(1);
						p.setMonth(pMonth - 1);
						pDays = p.getDays();
						for (var a = 6; a >= 0; a--) {
							if (week[a].text() !== '') continue;
							week[a].html('<a href="javascript:void(0);">' + (pDays--) + '</a>').addClass('pm');
							if ((pDays + 1) === that.selected.getDate() 
								&& d.getMonth() - 1 === that.selected.getMonth() 
								&& d.getFullYear() === that.selected.getFullYear()) {
								week[a].addClass('selected');
							}
						}
					} 
					// Last week
					else if (i > 4) {
						for (var a = 0; a <= 6; a++) {
							if (week[a].text() !== '') continue;
							week[a].html('<a href="javascript:void(0);">' + (nStartDate++) + '</a>').addClass('nm');
							if ((nStartDate - 1) === that.selected.getDate() 
								&& d.getMonth() + 1 === that.selected.getMonth() 
								&& d.getFullYear() === that.selected.getFullYear()) {
								week[a].addClass('selected');
							}
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
			cb(dates);
		},
		getNewMonth : function (dir, isTrigger) {
			var that = this,
				cal = that.calendar;
				curr = cal.find('.calendar-dates:eq(0)'),
				lblTodayDay = cal.find('.calendar-dayofweek'),
				lblTodayMonth = cal.find('.calendar-month'),
				lblTodayDate = cal.find('.calendar-date'),
				lblTodayYear = cal.find('.calendar-year'),
				lblMonth = cal.find('.calendar-curr-month'),
				container = cal.find('.calendar-date-holder');

			if (that.viewMode === 'days') {
				if (isTrigger) that.date.setMonth(that.date.getMonth() + ( dir === 'right' ? 1 : -1));
				that.getDays(that.date, function (dates) {
					if (isTrigger) {
						var cElem = curr.clone();
						cElem.addClass(dir + ' load').empty().append(dates).prependTo(container);
						curr.css({ marginLeft : (dir === 'left' ? '100%' : '-100%') });
						setTimeout(function () { cElem.removeClass('load'); }, 0);
						that.cleanUp(curr, cElem, dir);
					} else {
						if (curr.hasClass('months')) {
							var cElem = curr.clone();
							$('.calendar-labels').removeClass('invis');
							cElem.empty().append(dates).addClass('hasmonths').appendTo(container);
							curr.addClass('load');
							setTimeout(function () { cElem.removeClass('hasmonths'); }, 0);
							container.parent().removeAttr('style');
							that.cleanUp(curr, cElem, 'months');
						} else {
							curr.append(dates);
						}
					}
				});
				
				lblMonth.text(months[that.date.getMonth()] + ', ' + that.date.getFullYear());
				
				if (!isTrigger && !curr.hasClass('months')) {
					lblTodayDay.text(daysofweek[that.today.getDay()]);
					lblTodayMonth.text(months[that.today.getMonth()]);
					lblTodayDate.text(that.today.getDate());
					lblTodayYear.text(that.today.getFullYear());
				}
			} else {
				that.date.setYear(that.date.getFullYear() + ( dir === 'right' ? 1 : -1))
				lblMonth.text(that.date.getFullYear());
			}
		},
		create : function(){
			var that = this,
				mode = that.options.mode,
				overlay = $('<div class="calendar-overlay"></div>'),
				wrapper = $('<div class="calendar-wrapper load"></div>'),
				cardhead = $('<section class="calendar-head-card"><span class="calendar-dayofweek"></span><span class="calendar-month"></span><span class="calendar-date"></span><span class="calendar-year"></span></section>'),
				container = $('<div class="calendar-container"></div>'),
				calhead = $('<section class="calendar-top-selector"><span class="calendar-prev">&lsaquo;</span><span class="calendar-curr-month"></span><span class="calendar-next">&rsaquo;</span></section>'),
				datesgrid = $('<section class="calendar-grid">'
							+ '<div class="calendar-labels"><span>Sun</span><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span></div>'
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
		show : function () {
			var that = this;

			that.calendar.parent().fadeIn('fast');
			that.calendar.removeClass('load');
		},
		hide : function () {
			var that = this;
			that.calendar.addClass('load');
			that.calendar.parent().fadeOut(function () {
				// that.calendar.parent().remove();
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
				cal.calendar.on('dateselected', function (e) {
					that.val(e.date).trigger('onchange');
					that.trigger($.Event('dateselected', {date: e.date}));
					cal.hide();
				});
				this.blur();
			}).on('keydown', function(e){
				console.log(e.which);
				if(ex_keys.indexOf(e.which) < 0) return false; 
			});
		});
	};
}(jQuery);