DCalendar
=========

JQuery calendar plugin plus date picker for input fields.

##How to use
Make sure you include the jQuery library first.
Include `dcalendar.picker.css` and `dcalendar.picker.js` in your html file:
```html
<link rel="stylesheet" type="text/css" href="dcalendar.picker.css">
<script type="text/javascript" src="dcalendar.picker.js"></script>
```

Add a reference on your `input` element for later use:
```html
<input type="text" id="datepicker"/>
```

Then add this piece of code in your `script` tag:
```javascript
<script>
  $(document).ready(function(){
    $('#datepicker').dcalendarpicker(); //Initializes the date picker
  });
</script>
```

##Formatting
The default string format of the date is `mm/dd/yyyy`. You can specify the format you want by adding a parameter on initialization:
```javascript
<script>
  $(document).ready(function(){
    $('#datepicker').dcalendarpicker({format: 'mm-dd-yyy'}); //Initializes the date picker and uses the specified format
  });
</script>
```
The above code will output a date in this format `mm-dd-yyyy`, for example: `10-31-2016` - which is October 31, 2016.
You can specify other format you want, like `mmm dd, yyyy` which would output something like `Oct 01, 2016`.

##Min and Max
You can also specify the mininum and/or maximum date the user can select on othe date picker.
Just specify `data-mindate` and/or `data-maxdate` attributes on your `input` element. The acceptable values for these attributes are `today` or a specific date using this format: `mm/dd/yyyy`:
```html
<input type="text" id="datepicker" data-mindate="today"/>       //Dates enabled ranges from the current date onwards.
<input type="text" id="datepicker" data-mindate="10/30/2016"/>  //Dates enabled ranges from October 30, 2016 onwards.
<input type="text" id="datepicker" data-maxdate="today"/>       //Dates enabled ranges from earlier dates until current date.
<input type="text" id="datepicker" data-maxdate="10/30/2016"/>  //Dates enabled ranges from previous dates of October 10, 2016 until October 10, 2016
```
You can also specify the mininum and maximum date to create a specific date range acceptable:
```html
<input type="text" id="datepicker" data-mindate="1/1/2016" data-maxdate="2/1/2016"/>  //Dates enabled ranges from January 1 to February 1, 2016
```

##Event
The event `datechanged` is fired after selection of date in the date picker.
You can use this to get the new date value:
```javascript
<script>
  $(document).ready(function(){
    $('#datepicker').dcalendarpicker({format: 'mm-dd-yyy'}).on('datechanged', function(e){
      alert(e.date);
    });
  });
</script>
```
The above code will alert the new date selected. For example: `01-16-2016` or January 16, 2016
