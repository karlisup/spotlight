// TODO:
// 6) not working on iphone4 (calling sequence)
// 1) Make scrolling experience the same for all browsers/devices
// 2) Show scrolling bar only when there is something to scroll


(function(window){
    var widget = $('.spotlight')
    var input = $('.spotlight__input')
    var inputbg = $('.spotlight__inputbg')
    var list = $('.spotlight__list')
    var inputWrapper = $('.spotlight__search')
    var resultWrapper = $('.spotlight__results')
    var resultList = $('.spotlight__list')
    var thumb = $('.spotlight__thumb')
    var listScrolltop = 0
    // just imagine having Minecart driving up and down
    var itemHeight = 39 //px
    var minecartHeight = 10 * itemHeight; // default size 390px

    input.on('input', function () {
        // console.log(inputbg.html(), input.val(), inputbg.attr('data-autocomplete'))
        // if we delete everything: clear autocomplete
        // Gives (a fake) feeling that autocomplete is not slow
        // if input size bigger: add input a letter from suggestion
        // if input size smaller: add suggestion a letter from input
        // copy input text into inputbg

        if (input.val().length === 0) {
            returnResults('')
            inputbg.attr('data-autocomplete', '')
            inputbg.text('').html()
            resultWrapper.addClass('spotlight__results--empty')
            return
        }

        if (shouldUpdateCompletion(
            input.val(),
            inputbg.html(),
            inputbg.attr('data-autocomplete')))
        {
            var newCompletion = comepletionPart(
                input.val(),
                inputbg.html(),
                inputbg.attr('data-autocomplete'))
            inputbg.attr('data-autocomplete', newCompletion)
        }

        inputbg.text(input.val()).html()
    })

    function shouldUpdateCompletion(input, previousInput, previvousCompletion) {
        if (!startsWithSubstring(previousInput + previvousCompletion, input)) {
            return false
        }
        return true
    }

    function comepletionPart(input, previousInput, previvousCompletion) {
        if (previousInput.length < input.length) {
            return previvousCompletion.substring(1)
        } else {
            var string = previousInput
            var lastChar = string.charAt(string.length - 1)
            return lastChar + previvousCompletion
        }
    }

    function resetCtrl() {
        dblCtrlKey = 0
    }

    function closeIfClickedOutside(e) {
        if (!widget.is(e.target) && widget.has(e.target).length === 0) {
            hideSpotlight()
        }
    }

    function showSpotlight() {
        widget.addClass('spotlight--active')
        $(document).on('mouseup.hideSpotlight', closeIfClickedOutside)
        input.focus()
    }

    function hideSpotlight() {
        widget.removeClass('spotlight--active')
        $(document).off('.hideSpotlight') // document stops listening for clicks
    }

    var dblCtrlKey = 0;
    $(document).on('keydown', function (e) {
        var keyCode = e.keyCode || e.which;
        // show spotlight on Ctrl + Ctrl
        if (dblCtrlKey != 0 && keyCode == 17) {
            showSpotlight()
            resetCtrl()
        } else {
            dblCtrlKey++
            setTimeout(resetCtrl, 400);
        }

        // hide spotlight on ESC
        if (keyCode == 27) {
            hideSpotlight()
        }
    })



    input.on('keydown', function (e) {
        var keyCode = e.keyCode || e.which;

        if (keyCode == 9) { // tab - autocomplete
            e.preventDefault();
            if(inputWrapper.hasClass('spotlight__search--smalldescr')) {
                input.val(inputbg.attr('data-autocomplete').substring(3)) // remove " – " prefix
            } else {
                input.val(input.val() + inputbg.attr('data-autocomplete'))
            }
            clearTitle()
        }
        // TODO add the navigation
        if (keyCode == 38) { // top - navigate list
            e.preventDefault();
            setNextActiveItem('up')
        }
        if (keyCode == 40) { // bottom - navigate list
            e.preventDefault();
            setNextActiveItem('down')
        }
    });

    $(resultList).on('mousewheel', function (event) {
        if (event.originalEvent.wheelDelta >= 0) {
            if (minecartAtTheTop()) return
            singleScroll('up')
        }
        else {
            if (minecartAtTheBottom()) return
            singleScroll('down')
        }
    });

    /**
     * Called from outside on item hover
     */
    function selectItem(elem) {
        $('.spotlight__item--active').removeClass('spotlight__item--active')
        $(elem).addClass('spotlight__item--active')
    }

    // ||     ||
    // ||     ||
    // ||     ||
    // ||     || goes up
    // =========
    // |#######| minecart is the
    // |#######| visible parts of results
    // |#######|
    // |#######|
    // =========
    // ||     ||  goes down
    // ||     ||
    // ||     ||


    function minecartAtTheTop () {
        return resultList.scrollTop() === 0
    }
    function minecartAtTheBottom () {
        var trackLength = $('.spotlight__item').length * itemHeight
        return resultList.scrollTop() === trackLength - minecartHeight
    }
    function itemAtTheTopOfMinecart () {
        return $('.spotlight__item--active').position().top === 0
    }
    function itemAtTheBottomOfMinecart () {
        return $('.spotlight__item--active').position().top === minecartHeight - itemHeight
    }

    function singleScroll (direction) {
        if (direction === 'up') {
            listScrolltop -= itemHeight
        } else {
            listScrolltop += itemHeight
        }
        resultList.scrollTop(listScrolltop)
        refreshIntication()
    }

    function setNextActiveItem(direction) {
        var activeItem = $('.spotlight__item--active')

        if(direction === 'up') {
            if (minecartAtTheTop() && itemAtTheTopOfMinecart()) return
            if (itemAtTheTopOfMinecart()) {
                singleScroll('up')
            }
            activeItem.prev().addClass('spotlight__item--active')
        }
        else if (direction === 'down') {
            if (minecartAtTheBottom() && itemAtTheBottomOfMinecart()) return
            if (itemAtTheBottomOfMinecart()) {
                singleScroll('down')
            }
            activeItem.next().addClass('spotlight__item--active')

        }
        activeItem.removeClass('spotlight__item--active')
    }

    function refreshIntication() {
        var trackLength = $('.spotlight__item').length * itemHeight
        thumb.height(getIndicatorHeight(trackLength) + '%')
        thumb.css('top', getIndicatorDistanceFromTop(trackLength) + '%')
    }

    function getIndicatorDistanceFromTop (trackLength) {
        return listScrolltop * 100 / trackLength
    }

    function getIndicatorHeight(trackLength) {
        return minecartHeight * 100 / trackLength
    }

    function formatSingleSearchResult(img = null, title = '', subtitle = '') {
        var image = ''
        if (img) {
            image += '' +
            '<figure class="spotlight__figure">' +
                '<img src="' + img.src + '" alt="' + img.alt + '" class="spotlight__image">' +
            '</figure>'
        }
        return '' +
            '<li class="spotlight__item" onmouseover="spotlight.selectItem(this)">' +
                image +
                '<div class="spotlight__info">' +
                    '<h3 class="spotlight__title">' + title + '</h3>' +
                    '<p class="spotlight__subtitle">' + subtitle + '</p>' +
                '</div>' +
            '</li>'
    }
    function setAutocomplete(title) {
        clearTitle()
        // if beginning of the string matches title show autocomplete
        // else show it as a description via longdash ( – )
        if (startsWithSubstring(title.toLowerCase(), input.val().toLowerCase())) {
            if (inputWrapper.hasClass('spotlight__search--smalldescr')) {
                inputWrapper.removeClass('spotlight__search--smalldescr')
            }
            var otherPartOfTitle = title.substring(input.val().length)
            inputbg.attr('data-autocomplete', otherPartOfTitle)
        } else {
            if (!inputWrapper.hasClass('spotlight__search--smalldescr')){
                inputWrapper.addClass('spotlight__search--smalldescr')
            }
            inputbg.attr('data-autocomplete', " – " + title)
        }
    }

    function returnResults(results) {
        list.html(results)

        if (results !== '') {
            // remove empty results class
            if (resultWrapper.hasClass('spotlight__results--empty')) {
                resultWrapper.removeClass('spotlight__results--empty')
            }
            // select first item
            $('.spotlight__item', resultList).first().addClass('spotlight__item--active')
        } else {
            resultWrapper.addClass('spotlight__results--empty')
        }

    }

    /**
     * Returns if text starts with substring
     * @param {string} text
     * @param {string} substring
     * @returns {boolean}
     */
    function startsWithSubstring(text, substring) {
        text = text.toLowerCase()
        substring = substring.toLowerCase()
        if(text.match("^" + substring)) {
            return true
        } else {
            return false
        }
    }

    function clearTitle() {
        inputbg.attr('data-autocomplete', '')
    }

    var spotlight = {
        selectItem: selectItem,
        formatSingleSearchResult: formatSingleSearchResult,
        clearTitle: clearTitle,
        returnResults: returnResults,
        setAutocomplete: setAutocomplete
    }
    window.spotlight = spotlight

})(window)




// Utility function
// TODO: move inside it somewhere
function copyToClipboard(text) {
    if (window.clipboardData && window.clipboardData.setData) {
        // IE specific code path to prevent textarea being shown while dialog is visible.
        return clipboardData.setData("Text", text);

    } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
        var textarea = document.createElement("textarea");
        textarea.textContent = text;
        textarea.style.position = "fixed";  // Prevent scrolling to bottom of page in MS Edge.
        document.body.appendChild(textarea);
        textarea.select();
        try {
            return document.execCommand("copy");  // Security exception may be thrown by some browsers.
        } catch (ex) {
            console.warn("Copy to clipboard failed.", ex);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }
}
