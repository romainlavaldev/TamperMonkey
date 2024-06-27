// ==UserScript==
// @name         BetterGitHoub
// @namespace    http://tampermonkey.net/
// @version      2024-06-25
// @description  try to take over the world!
// @author       You
// @match        *://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        none

// @require https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==
(function() {
    'use strict';

    var rldev_projects = [
        {
            display: 'Drouin',
            id: 'Drouin-Core',
            project: '1'
        },
        {
            display: 'ITF',
            id: 'ITF-Suivi_Dossiers',
            project: '5'
        }
    ];


    waitForKeyElements('.AppHeader-globalBar-start', addFavoritesProjects);

    waitForKeyElements('.AppHeader-context-full > nav > ul', addPrShortcut);

    waitForKeyElements('#js-issues-toolbar', colorPrRows);

    function addFavoritesProjects($container) {
        rldev_projects.forEach(e => $container.append(`
        <div class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted" style="display: flex; gap: 16px; margin-left: auto; padding-left: 16px; padding-right: 16px;">
            <a href="/Team-AppliDev/${e.id}" class="color-fg-muted">${e.display}</a>
            <a href="/Team-AppliDev/${e.id}/pulls" class="color-fg-muted">PR</a>
            <a href="/orgs/Team-AppliDev/projects/${e.project}" class="color-fg-muted">PROJ</a>
        </div>
    `));
    }

    function addPrShortcut($container) {
        $container.append(`
        <div class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted" style="display: flex; gap: 16px; padding-left: 16px; padding-right: 16px;">
            <a href="https://github.com/pulls?q=is%3Aopen+is%3Apr+org%3ATeam-AppliDev+-reviewed-by%3Aapdev-RomainLaval" class="color-fg-muted">PR to review</a>
        </div>
        <div class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted" style="display: flex; gap: 16px; padding-left: 16px; padding-right: 16px; margin-left: 8px;">
            <a href="https://github.com/pulls?q=is%3Aopen+is%3Apr+org%3ATeam-AppliDev" class="color-fg-muted">All PR</a>
        </div>
    `);
    }

    function colorPrRows($container) {

        $container.find('.js-issue-row').each((_, row) => {
            console.log($(row).find('.opened-by').next());
            if (!$(row).find('.opened-by').next('span').find('a').text() == 'Approved') $(row).css('background-color', 'green')
        });
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
 actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
 bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
 iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
            .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                waitForKeyElements (    selectorTxt,
                                    actionFunction,
                                    bWaitOnce,
                                    iframeSelector
                                   );
            },
                                       300
                                      );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
