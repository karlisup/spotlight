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
                setAutocomplete(title)
            } else {
                clearTitle();
                clearResults();
            }
        });
    }

    // result module specific code
    function returnWeatherForecast(forecast) {
        var populatedResults = ''
        $(forecast).each(function() {
            var image = {}
            image.alt = this.text
            // console.log(this.text)
            if (!["Snow Showers", "Rain And Snow", "Rain", "Partly Cloudy", "Mostly Cloudy", "Cloudy", "Showers", "Scattered Showers", "Scattered Thundershowers", "Mostly Sunny", "Thunderstorms", "Sunny", "Clear", "Snow", "Scattered Thunderstorms", "Breezy", "Mostly Clear", "Scattered Snow Showers", "Isolated Thunderstorms", "Windy"].includes(this.text)) {
                alert(this.text);
            }
            switch (this.text) {
                case "Snow Showers":
                case "Rain And Snow":
                case "Scattered Snow Showers":
                    image.src = "006-snowing-2.svg"
                    break;
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
            // console.log(image);
            populatedResults += populateSingleSearchResult(
                image,
                'from ' + this.low + '° to ' + this.high + '°C' ,
                this.date + ' (' + this.day + ')'
            )
        })
        returnResults(populatedResults)
    }

})()