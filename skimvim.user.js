// ==UserScript==
// @name           SkimVim
// @namespace      http://seliopoul.us
// @description    Vim navigation for New York Times' Article Skimmer
// @include        http://prototype.nytimes.com/gst/articleSkimmer/
// ==/UserScript==

(function () {
    // This looks unsafe, but it works.
    var Skimmer = unsafeWindow.Skimmer;
    var console = unsafeWindow.console;
    var $ = unsafeWindow.$;


    // A bunch of state. Gross.
    var insertModeContext;
    var currentStory;
    var insertMode = false;


    // Get rid of old navigation bindings.
    $(unsafeWindow.document).unbind("keyup");

    // Up: 'J'
    Skimmer.Key.press(74, function () {
        if (insertMode) {
            if (currentStory == 0 && insertModeContext.get(4)) {
                selectStory(4);
            } else if (insertModeContext.get(currentStory + 5)) {
                selectStory(currentStory + 5);
            }
        } else {
            Skimmer.application.nextSource();
        }
    });

    // Down: 'K'
    Skimmer.Key.press(75, function () {
        if (insertMode) {
            if (currentStory == 4 || currentStory == 5) {
                selectStory(0);
            } else if (insertModeContext.get(currentStory - 5)) {
                selectStory(currentStory - 5);
            }
        } else {
            Skimmer.application.previousSource();
        }
    });

    // Left: "H"
    Skimmer.Key.press(72, function () {
        if (insertMode) {
            if (currentStory > 0) {
                selectStory(currentStory - 1);
            }
        }
    });

    // Right: "K"
    Skimmer.Key.press(76, function () {
        if (insertMode) {
            if (currentStory < insertModeContext.length - 1) {
                selectStory(currentStory + 1);
            }
        }
    });

    // Follow a link: "Enter" / "CR"
    Skimmer.Key.press(13, function () {
        if (insertMode) {
            window.location = $("a", $(insertModeContext.get(currentStory))).attr("href");
        }
    });

    // Navigate through stories ("insert mode")
    Skimmer.Key.press(73, enterStoryMode);

    // Navigate through sources ("command mode")
    Skimmer.Key.press(27, exitStoryMode);

    // Also enter "command mode" when a source is manuall clicked
    $("#skimmerPageNavigation li").click(exitStoryMode);

    function enterStoryMode() {
        var currentSource = Skimmer.application.currentSourceName().replace(/[ .\/&]/g, '');
        insertMode = true;
        insertModeContext = $(".slideSet li", $("#shrinkwrap-" + currentSource));
        selectStory(0);
    }

    function exitStoryMode() {
        var currentSource = Skimmer.application.currentSourceName().replace(/[ .\/&]/g, '')
        insertMode = false;
        selectStory(null);
        insertModeContext = null;
    }

    /*
     * Select visible story with the given index.
     */
    function selectStory(index) {
        $(".container", $(insertModeContext.get(currentStory))).css("background-color", "white");

        if (index !== null) {
            currentStory = index;
            $(".container", $(insertModeContext.get(currentStory))).css("background-color", "black");
        }
    }
})();
