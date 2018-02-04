<p align="center">
  <a href="https://karlisup.github.com/spotlight">
    <img src="https://raw.githubusercontent.com/karlisup/spotlight/master/spotlight.gif">
  </a>    
</p>

# Spotlight
Search widget for your web API · [Demo](https://karlisup.github.com/spotlight)

## Features
- **Simple & Fast** - Have your search results without moving your hands from keyboard where you want them.
- **Your API** - Connect your API and handle it as you want - in front end or back end. Front end example.
- **Keybindings** - Do whatever you imagine with your results. Copy, open link in a new page, execute ```JavaScript``` script.
- **Autocomplete** - Find faster thing you have been looking for. One letter may be enough.
- **Theamable** - Change the look of the search input or the results to your liking.
- **Open Source** - Use it in any project you desire. Let your imagination be the only limit.

## Getting Started
These instructions will get you a copy of spotlight search feature with demo weather API up and running on your local machine.

### Prerequisites
For now spotlight requires jQuery. Include this code before closing `<body>` tag.
```html
<script src="/assets/js/jquery-3.2.1.min.js"></script>
<script src="/assets/js/spotlight.js"></script>
<script src="/assets/js/spotlight-modules.js"></script>
```
For style put this in `<head>` section
```html
<link rel="stylesheet" href="/assets/css/spotlight.css">
```
Put this spotlight container between `<body>` tags.
```html
<nav class="spotlight">
    <div class="spotlight__search">
        <div class="spotlight__inputbg" data-autocomplete=""></div>
        <input class="spotlight__input" type="text" autofocus>
    </div>
    <div class="spotlight__results spotlight__results--empty">
        <ul class="spotlight__list"></ul>
        <div class="spotlight__indicator">
            <div class="spotlight__thumb"></div>
        </div>
    </div>
</nav>
```

### Configuration in `spotlight-modules.js`
Control when you want to do call to the API e.g:
* when string starts with `wf ` call `getForecast`
* when string is longer then 3 chars
* when string is not empty
```javascript
input.on('input', function () {
    var searchString = input.val();
    if (searchString.length > 0) {
        // get Forecast
        getForecast(searchString)
    }
})
```
Configure actions. In **example** what to do when `Ctrl`/`Cmd`+`C` has been hit.
```javascript
input.on('keydown', function (e) {
    var keyCode = e.keyCode || e.which;
    // configure what to copy when Ctrl/Cmd+C is triggered
    if ((e.ctrlKey || e.metaKey) && keyCode == 67) {
        var title = $('.spotlight__title', '.spotlight__item--active').html()
        var subtitle = $('.spotlight__subtitle', '.spotlight__item--active').html()
        copyToClipboard(subtitle + ' ' + title)
    }
    // after actions gain focus back on input
    $('.spotlight__input').focus();
});
```

Getting forecast **example**.
```javascript
function getForecast(location) {
        var locationQuery = escape("select item from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + location + "') and u='c'"),
            locationUrl = "https://query.yahooapis.com/v1/public/yql?q=" + locationQuery + "&format=json";
        $.ajax({
            url: locationUrl,
            method: 'GET'
        }).then(function (data) {
            if (data.query.results !== null) {
                var ajaxResults = data.query.results.channel.item;
                var title = ajaxResults.title.substring(15) // remove text "Conditions for "
                returnWeatherForecast(ajaxResults.forecast)
                spotlight.setAutocomplete(title)
            } else {
                spotlight.clearTitle();
                spotlight.returnResults('');
            }
        });
    }
```
Returning processed forecast data to Spotlight **example**.
```javascript
function returnWeatherForecast(forecast) {
    var populatedResults = ''
    var forecast = forecast.concat(forecast)
    $(forecast).each(function() {
        var image = {}
        image.alt = this.text
        switch (this.text) {
            case "Blowing Snow":
            case "Snow Showers":
            case "Rain And Snow":
            case "Scattered Snow Showers":
                image.src = "006-snowing-2.svg"
                break;
            case "Wintry Mix":
            case "Snow":
                image.src = "007-snowing.svg"
                break;
            case "Partly Cloudy":
            case "Mostly Cloudy":
            case "Mostly Sunny":
                image.src = "003-cloudy-day.svg"
                break;
            case "Rain":
            case "Showers":
            case "Scattered Showers":
                image.src = "009-rain.svg"
                break;
            case "Cloudy":
                image.src = "008-cloudy.svg"
                break;
            case "Scattered Thundershowers":
            case "Isolated Thunderstorms":
            case "Thunderstorms":
            case "Scattered Thunderstorms":
                image.src = "002-storm.svg"
                break;
            case "Sunny":
            case "Clear":
            case "Mostly Clear":
                image.src = "005-sun.svg"
                break;
            case "Windy":
            case "Breezy":
                image.src = "001-wind.svg"
                break;
            default:
                image.src = null;
        }
        if (image.src === null) {
            image = null
        } else {
            image.src = 'assets/images/weather/' + image.src
        }

        populatedResults += spotlight.formatSingleSearchResult(
            image,
            'from ' + this.low + '° to ' + this.high + '°C' ,
            this.date + ' (' + this.day + ')'
        )
    })
    spotlight.returnResults(populatedResults)
}
```

## Keybindings
- ```Ctrl``` ```Ctrl``` - Show search bar
- ```Esc``` - Exit search
- ```Tab``` - Autocomplete
- ```Up``` - Navigate up
- ```Down``` - Navigate down
- ```Cmd/Ctrl + C``` - Copy string

## Contributing
As this is my free time fun project any suggestions, contributions are most welcome. Feel free to open issues, or contact me.
Have ☀️ Day!
