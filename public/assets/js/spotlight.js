// TODO:
// 6) not working on iphone4 (calling sequence)
// 1) Having a scrollable list that is longer than 10 items
// 2) Create function that selects next element in the list
// 3) Create function that selects previous element in the list
// 4) Attach top/bottom arrows to trigger functions 2) & 3)
// 5) Attach scrolling to trigger functions 2) & 3)
// 6) Create a scrollbar to indicate "scrolling position"



(function(window){
    var input = $('.spotlight__input')
    var inputbg = $('.spotlight__inputbg')
    var list = $('.spotlight__list')
    var inputWrapper = $('.spotlight__search')
    var resultList = $('.spotlight__list')
    
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

    function setNextActiveItem(direction) {
        var activeItem = $('.spotlight__item--active')
        if(direction === 'up') {
            activeItem.prev().addClass('spotlight__item--active')
        }
        else if (direction === 'down') {
            activeItem.next().addClass('spotlight__item--active')
        }
        activeItem.removeClass('spotlight__item--active')
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
            '<li class="spotlight__item">' +
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
        // select first item
        if (results !== '') {
            $('.spotlight__item', resultList).first().addClass('spotlight__item--active')
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

    // make some functions publicly available
    // TODO: add namespace e.g. window.spotlight.ret...
    window.formatSingleSearchResult = formatSingleSearchResult;
    window.clearTitle = clearTitle;
    window.returnResults = returnResults;
    window.setAutocomplete = setAutocomplete;

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
