(function () {
    var input = $('.spotlight__input')

    // bind events
    input.on('input', function () {
        var searchString = input.val();
        if (searchString.length > 0) {
            // get Forecast
            // setAutocomplete(searchString)
            getForecast(searchString)
        }
    })

    // configure actions for modules (e.g. show on right/left pane)
    input.on('keydown', function (e) {
        var keyCode = e.keyCode || e.which;

        // configure what to copy when Ctrl/Cmd+C is triggered
        if ((e.ctrlKey || e.metaKey) && keyCode == 67) {
            // e.g. if string starts with string
            // 'wf' copy weather forcast title + ..
            var title = $('.spotlight__title', '.spotlight__item--active').html()
            var subtitle = $('.spotlight__subtitle', '.spotlight__item--active').html()
            console.log(title, subtitle)
            copyToClipboard(subtitle + ' ' + title)
        }
        // after actions gain focus back on input
        $('.spotlight__input').focus();
    });

    // general functions
    function getForecast(location) {
        var locationQuery = escape("select item from weather.forecast where woeid in (select woeid from geo.places(1) where text='" + location + "') and u='c'"),
            locationUrl = "http://query.yahooapis.com/v1/public/yql?q=" + locationQuery + "&format=json";
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

    // result module specific code
    function returnWeatherForecast(forecast) {
        var populatedResults = ''
        $(forecast).each(function() {
            var image = {}
            image.alt = this.text

            if (!["Snow Showers", "Rain And Snow", "Rain", "Partly Cloudy", "Mostly Cloudy", "Cloudy", "Showers", "Scattered Showers", "Scattered Thundershowers", "Mostly Sunny", "Thunderstorms", "Sunny", "Clear", "Snow", "Scattered Thunderstorms", "Breezy", "Mostly Clear", "Scattered Snow Showers", "Isolated Thunderstorms", "Windy", "Wintry Mix"].includes(this.text)) {
                alert(this.text);
            }
            switch (this.text) {
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
                image.src = '/assets/images/weather/' + image.src
            }

            populatedResults += formatSingleSearchResult(
            populatedResults += spotlight.formatSingleSearchResult(
                image,
                'from ' + this.low + '° to ' + this.high + '°C' ,
                this.date + ' (' + this.day + ')'
            )
        })
        spotlight.returnResults(populatedResults)
    }

})()
