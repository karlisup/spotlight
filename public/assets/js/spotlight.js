// TODO:
// 2) arrow movement still maintaining the focus
// 3) actions (still in progress?)
//        - copy (something from attributes)
//        - open on left/right
// 4) show description in smaller case
// 5) do different autocomplete for -- description.
// 6) not working on iphone4 (calling sequence)



(function(window){
    var input = $('.spotlight__input')
    var inputbg = $('.spotlight__inputbg')
    var list = $('.spotlight__list')
    var inputWrapper = $('.spotlight__search')
    
    input.on('input', function () {   
        // console.log(inputbg.html(), input.val(), inputbg.attr('data-autocomplete'))     
        // if we delete everything: clear autocomplete
        // Gives (a fake) feeling that autocomplete is not slow
        // if input size bigger: add input a letter from suggestion
        // if input size smaller: add suggestion a letter from input
        // copy input text into inputbg
        if (input.val().length === 0) {
            inputbg.attr('data-autocomplete', '')
        }
        else if (!startsWithSubstring(inputbg.html() + inputbg.attr('data-autocomplete'), input.val())) {
            console.log('Doesn\'t start with substring')
        }
        else if (inputbg.html().length < input.val().length) {
            inputbg.attr('data-autocomplete', inputbg.attr('data-autocomplete').substring(1) )
        } else {
            var string = inputbg.html()
            var lastChar = string.charAt(string.length - 1)
            inputbg.attr('data-autocomplete', lastChar + inputbg.attr('data-autocomplete'))
        }
        
        inputbg.text(input.val()).html()
    })

    input.on('keydown', function (e) {
        var keyCode = e.keyCode || e.which;

        if (keyCode == 9) { // tab - autocomplete
            e.preventDefault();
            input.val(input.val() + inputbg.attr('data-autocomplete'))
            clearTitle()
        }
        if (keyCode == 38) { // top - navigate list
            e.preventDefault();
        }
        if (keyCode == 40) { // bottom - navigate list
        }
    });

    function populateSingleSearchResult(img = null, title = '', subtitle = '') {
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
        if (title.toLowerCase().match("^" + input.val().toLowerCase())) {
            var otherPartOfTitle = title.substring(input.val().length)            
            inputbg.attr('data-autocomplete', otherPartOfTitle)
        } else {
            inputbg.attr('data-autocomplete', " – " + title)
        }
    }

    function returnResults(results) {
        // set results
        clearResults()
        list.append(results)
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
        console.log(substring+"|||"+text, text.match("^" + substring))
        if(text.match("^" + substring)) {
            return true
        } else {
            return false
        }
    }

    function clearResults() {
        list.empty()
    }

    function clearTitle() {
        inputbg.attr('data-autocomplete', '')
    }

    // make some functions publicly available
    // TODO: hah most of the functions now are public - really?
    window.returnResults = returnResults;
    window.populateSingleSearchResult = populateSingleSearchResult;
    window.clearTitle = clearTitle;
    window.clearResults = clearResults;
    window.returnResults = returnResults;
    window.setAutocomplete = setAutocomplete;

})(window)