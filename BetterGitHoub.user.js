// ==UserScript==
// @name         BetterGitHoub
// @namespace    http://tampermonkey.net/
// @version      2024-06-25
// @description  try to take over the world!
// @author       You
// @match        *://github.com/*
// @icon         https://github.githubassets.com/favicons/favicon.svg
// @grant        GM_addStyle

// @require https://code.jquery.com/jquery-3.6.0.min.js
// ==/UserScript==
(function() {
    'use strict';

    const fav_projects = [
        
    ];

    const lightTheme = $('html').attr('data-color-mode') == 'light';
    const user = $('[data-login]').first().attr('data-login');

    GM_addStyle(`
.search-input {
width: unset;
}

.AppHeader .AppHeader-globalBar .AppHeader-search .AppHeader-search-whenRegular {
min-width: unset;
}
    `);

    waitForKeyElements('.AppHeader-globalBar-start', addFavoritesProjects);

    waitForKeyElements('.AppHeader-context-full > nav > ul', addPrShortcut);

    waitForKeyElements('a[href*="/pull"].tooltipped', customPrRows);

    waitForKeyElements('[aria-label="Issues"] .js-issue-row', customIssueRow);

    waitForKeyElements('[class*="TokenTextContainer"]', customTokens);

    waitForKeyElements('.board-view-column-card > div', customCards);

    waitForKeyElements('.AppHeader-logo, .header-logo, [href="https://github.com/"]:has(svg), [href="https://github.com"]:has(svg), [href="https://github.com/github"]:has(svg)', changeLogo);

    function addFavoritesProjects($container) {
        fav_projects.forEach(e => $container.append(`
        <div class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted" style="display: flex; gap: 16px; margin-left: auto; padding-left: 16px; padding-right: 16px; background-color: ${e.bg ?? 'transparent'};">
            <a href="/Team-AppliDev/${e.id}" class="color-fg-muted" style="color: ${e.color ?? 'var(--fgColor-muted)'} !important;">${e.display}</a>
            <a href="/Team-AppliDev/${e.id}/pulls" class="color-fg-muted" style="color: ${e.color ?? 'var(--fgColor-muted)'} !important;">PR</a>
            <a href="/orgs/Team-AppliDev/projects/${e.project}" class="color-fg-muted" style="color: ${e.color ?? 'var(--fgColor-muted)'} !important;">PROJ</a>
        </div>
    `));
    }

    function addPrShortcut($container) {
        $container.append(`
        <div class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted" style="display: flex; gap: 16px; padding-left: 16px; padding-right: 16px;">
            <a href="/Team-AppliDev/" class="color-fg-muted">Applidev</a>
        </div>
        <div class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted" style="display: flex; gap: 16px; padding-left: 16px; padding-right: 16px; margin-left: 8px;">
            <a href="https://github.com/pulls?q=is%3Aopen+is%3Apr+org%3ATeam-AppliDev+-reviewed-by%3A${user}+-author%3A${user}" class="color-fg-muted">PR to review</a>
        </div>
        <div class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted" style="display: flex; gap: 16px; padding-left: 16px; padding-right: 16px; margin-left: 8px;">
            <a href="https://github.com/pulls?q=is%3Aopen+is%3Apr+org%3ATeam-AppliDev" class="color-fg-muted">All PR</a>
        </div>
        <div class="Button Button--iconOnly Button--secondary Button--medium AppHeader-button color-fg-muted" style="display: flex; gap: 16px; padding-left: 16px; padding-right: 16px; margin-left: 8px;">
            <a href="https://github.com/pulls?q=is%3Aopen+is%3Apr+org%3ATeam-AppliDev+author%3A${user}" class="color-fg-muted">My PR</a>
        </div>
    `);
    }

    function customPrRows($a) {
        // Colors
        if ($a.text().trim() == 'Review required') {
            $a.closest('.js-issue-row').css('background-color', lightTheme ? '#ffbf48' : '#895B06')
        } else if ($a.text().trim() == 'Approved') {
            $a.closest('.js-issue-row').css('background-color', lightTheme ? '#7cff8b' : '#074B2D')
        } else if ($a.text().trim() == 'Changes requested') {
            $a.closest('.js-issue-row').css('background-color', lightTheme ? '#ff6b6b' : '#840B23')
        }
    }

    function customTokens($token) {
        let tokenLeaf = $token.find(':not(:has(*))');
        if (tokenLeaf.not(':has(*)')) {
            tokenLeaf = $token;
        }

        if (tokenLeaf.text() == "XS") {
            tokenLeaf.text(tokenLeaf.text() + " 0h-1h");
        }if (tokenLeaf.text() == "S") {
            tokenLeaf.text(tokenLeaf.text() + " 1h-0.5j");
        }if (tokenLeaf.text() == "M") {
            tokenLeaf.text(tokenLeaf.text() + " 0.5j-1j");
        }if (tokenLeaf.text() == "L") {
            tokenLeaf.text(tokenLeaf.text() + " 1j-2j");
        }if (tokenLeaf.text() == "XL") {
            tokenLeaf.text(tokenLeaf.text() + " 2j+");
        }
    }

    function customCards($card) {
        // double click on card to open issue
        $card.on('dblclick', function() {
            console.log($(this).find('a'))
            $(this).find('a')[0].click();
        });

        // Color card assigned to me
        if ($card.find('img[data-testid="github-avatar"]').attr('alt') == user) {
            $card.css('background-color', lightTheme ? 'lavender' : 'darkslategrey');
        }
    }

    function customIssueRow($issue) {
        if ($issue.find('img.avatar-user').attr('alt')?.replace('@', '') == user) {
            $issue.css('background-color', lightTheme ? 'lavender' : 'darkslategrey');
        }
    }

    function changeLogo($logoLink) {
        $logoLink.empty().append(`
        <svg height="32" aria-hidden="true" viewBox="0 0 299 299" version="1.1" width="32" data-view-component="true" class="octicon octicon-mark-github v-align-middle color-fg-default">
            <g transform="translate(0.000000,299.000000) scale(0.100000,-0.100000)"
fill="#ea5e21" stroke="none">
            <path d="M1365 2980 c-247 -21 -486 -105 -705 -248 -106 -70 -327 -288 -394
-390 -120 -183 -208 -398 -242 -597 -22 -134 -22 -367 1 -499 26 -150 78 -306
114 -340 16 -16 27 -34 25 -41 -9 -23 22 -91 89 -191 72 -110 125 -164 160
-164 19 0 25 -8 35 -44 9 -35 25 -56 74 -100 113 -99 157 -126 209 -126 44 0
47 -2 52 -30 5 -24 18 -35 64 -59 218 -109 510 -163 768 -141 362 31 681 181
935 439 208 211 337 453 401 751 33 150 33 438 1 586 -86 401 -307 729 -640
953 -139 94 -347 181 -514 215 -73 15 -281 37 -323 34 -11 0 -61 -4 -110 -8z
m380 -76 c513 -90 954 -475 1109 -970 52 -167 61 -235 61 -444 -1 -176 -3
-206 -28 -308 -67 -285 -201 -518 -415 -724 -352 -338 -846 -469 -1321 -352
-112 28 -290 96 -302 116 -20 32 32 137 200 403 204 324 714 1009 1005 1348
39 47 47 61 35 68 -8 5 -19 9 -25 9 -14 0 -236 -235 -449 -474 -407 -457 -696
-837 -831 -1091 -41 -77 -46 -92 -42 -136 5 -46 3 -49 -17 -49 -24 0 -112 61
-178 123 -63 59 -53 91 90 299 205 300 706 813 1102 1130 69 56 158 129 196
162 39 33 72 62 74 63 3 2 -6 14 -18 27 l-23 25 -134 -90 c-279 -186 -523
-382 -803 -642 -299 -279 -516 -524 -578 -652 -37 -77 -38 -84 -19 -137 12
-33 12 -38 -1 -38 -32 0 -55 25 -130 137 -92 138 -96 160 -41 241 139 206 459
489 790 697 68 43 205 131 305 197 101 66 271 164 378 219 183 94 203 107 189
121 -19 20 -555 -232 -814 -382 -345 -201 -694 -466 -819 -624 -82 -103 -103
-166 -76 -229 11 -26 -20 -22 -40 6 -23 33 -71 190 -91 298 -23 126 -23 361 0
488 90 494 419 900 878 1085 104 42 262 82 373 95 102 12 294 5 410 -15z"/>

            </svg>
            </g>
        `);
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
