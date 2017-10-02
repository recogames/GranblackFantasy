/*:

 PH - Tips Book
 @plugindesc This plugin allows the creation and management of a tips book via a Common Event and Plugin Commands.
 @author PrimeHover
 @version 2.0.0
 @date 05/19/2016

 ---------------------------------------------------------------------------------------
 This work is licensed under the Creative Commons Attribution 4.0 International License.
 To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/
 ---------------------------------------------------------------------------------------

 @param ---Screen Options---
 @default

 @param Show in Menu
 @desc Allows having access of the tips book via menu (1: true, 0: false) (Ignore it if you are using Yanfly Main Menu Manager)
 @default 1

 @param Name in Menu
 @desc Changes the name of the tips book on the menu (Ignore it if you are using Yanfly Main Menu Manager)
 @default Tips Book

 @param Show Icons
 @desc Show an icon before the name of the tips (1: yes, 0: no)
 @default 1

 @param Background Image
 @desc Image for background of the tips book (PNG image only; Leave it in blank to have the default background)
 @default

 @param ---Category Options---
 @default

 @param Category IDs
 @desc ID of the categories to be displayed separated by commas (,) (each one has to be unique!)
 @default primary, secondary, completed, failed

 @param Category Texts
 @desc Texts of the categories to be displayed separated by commas (,) (it has to be placed in the same order as the category ids!)
 @default Primary, Secondary, Completed, Failed

 @param Category Icons ID
 @desc Icons of the categories to be displayed separated by commas (,) (it has to be placed in the same order as the category ids!)
 @default 312, 311, 310, 309

 @param ---Default Options---
 @default

 @param Icon Default Tips
 @desc ID of the icon to be displayed in case the tips does not have a specific category
 @default 312

 @param Text Default Tips
 @desc Default text to be shown when the tips does not have a specific category
 @default Default

 @param Text No Tipss
 @desc Text to be shown when no tipss are available
 @default No Tipss Available

 @param ---Additional Options---
 @default

 @param Text Title
 @desc Text of the title of the book
 @default My Tips Book

 @param Text Title Color
 @desc Color for the text of the title of the book (RMMV Color Code)
 @default 0

 @help

 Plugin Command:
    PHTipsBook add Title_of_the_tips                   # Add a tips in the book
    PHTipsBook remove Title_of_the_tips                # Remove a tips from the book
    PHTipsBook clear                                    # Clear the Tips Book
    PHTipsBook show                                     # Open the Tips Book
    PHTipsBook change Title_of_the_tips|category       # Changes the category of a tips
    PHTipsBook update Title_of_the_tips                # Updates an existent tips

 ========================================

 HOW TO USE:

    CREATING A CATEGORY:
    - In order to create a category, you have to set 3 required parameters, which are: [Category IDs], [Category Texts] and [Category Icons IDs]. Here is an example of these three parameters.

        [Category IDs]:         primary, secondary, completed, failed
        [Category Texts]:       Primary, Secondary, Completed, Failed
        [Category Icons IDs]:   312, 311, 310, 309

    - In the example above, the "primary" in [Category IDs] will be a category. The text that will be displayed when a tips is in this category is "Primary", and the default icon for this category is the ID "312".
    - As I stated earlier, you can have as many categories as you want. You just need to separate the ids, names and icons with a comma (,).
    - IMPORTANT: Make sure that you have the same amount of ids, texts and icons. In other words, if you have 4 IDs, you must have 4 Texts and 4 Icons.


    WRITING A QUEST:
    - Open the database and go to the section "Common Events"
    - Create a common event with the name "PHTipsBook" (without quotation marks)
    - Create one or several comments to create tipss.
    - The comments need to follow a pattern:

        {Example of Tips Title|categoryID|iconID}
        Description of the Tips.

    - The "categoryID" is optional, but it is highly recommended in order to sort your tipss. You can set as many categories as you want using the parameter [Category IDs]. If you don't specify the category of the tips, it will be set as "default".
    - The "iconID" is also optional. You can put the ID of the icon you want to show for this tips. If you don't specify an item, the tips will get the default for its category.
    - You are allowed to have several comments meaning one tips (you don't need to use just the 6 lines for comments, you can add a new comment right below and keep going).
    - You are allowed to write control characters in the description of the tips (such as \C[n], \I[n], \V[n]).
    - You are allowed to use some special tags to get the name of an item, weapon, armor, enemy or actor. When you are writing the description of a tips, use the tags <enemy:ID>, <actor:ID>, <item:ID>, <weapon:ID> and <armor:ID> to print the name of the particular item on the description. Change "ID" for the corresponding number you want.
    - There is a tag called [break-on-update]. When you use it, all the content of the same tips will be hidden, and it will just appear in the tips book when you call the plugin command "PHTipsBook update Title_of_the_tips".
    - You are allowed to have as many [break-on-update] as you want. And always when you call the plugin command for updating, it will allow the player to see a new part of the tips.
      (This is a good feature if you want to have a "step-by-step" tips, where each time the player completes the tips, the same tips is updated and new things have to be done).

    REGISTERING A QUEST ON THE BOOK:
    - To register a tips in the book, create an event in the map, go to "Plugin Command" and type the command for adding the tips
         Ex.: PHTipsBook add Example of Tips Title
    - To check the status or category of the tips, you can use these Script commands:

         PHPlugins.PHTipss.isActive("Title of the Tips");
         PHPlugins.PHTipss.is("Title of the Tips", "categoryID");


 ========================================

 Notes:

 "Example of Tips Title" does not need to be a single word or between quotation marks, it can be several words meaning one title.

 */

/* Global variable for PH Plugins */
var PHPlugins = PHPlugins || {};
PHPlugins.Parameters = PluginManager.parameters('PH_TipsBook');
PHPlugins.Params = PHPlugins.Params || {};

/* Global variable for the list of tipss */
PHPlugins.PHTipss = null;

/* Getting the parameters */
PHPlugins.Params.PHTipsAddToMenu = Number(PHPlugins.Parameters['Show in Menu']);
PHPlugins.Params.PHTipsMenuText = String(PHPlugins.Parameters['Name in Menu']);
PHPlugins.Params.PHTipsDisplayType = Number(PHPlugins.Parameters['Display Type']);
PHPlugins.Params.PHTipsBackgroundImage = String(PHPlugins.Parameters['Background Image']);

PHPlugins.Params.PHTipsDisplayIcon = Number(PHPlugins.Parameters['Show Icons']);
PHPlugins.Params.PHTipsIconDefault = Number(PHPlugins.Parameters['Icon Default Tips']);

PHPlugins.Params.PHTipsTextTitle = String(PHPlugins.Parameters['Text Title']);
PHPlugins.Params.PHTipsTextTitleColor = Number(PHPlugins.Parameters['Text Title Color']);

PHPlugins.Params.PHTipsTextDefault = String(PHPlugins.Parameters['Text Default Tips']);
PHPlugins.Params.PHTipsTextNoTips = String(PHPlugins.Parameters['Text No Tipss']);

PHPlugins.Params.PHTipsCategoryId = String(PHPlugins.Parameters['Category IDs']);
PHPlugins.Params.PHTipsCategoryTexts = String(PHPlugins.Parameters['Category Texts']);
PHPlugins.Params.PHTipsCategoryIcons = String(PHPlugins.Parameters['Category Icons ID']);

(function() {

    /* CLASS PHTipsBook */
    function PHTipsBook() {
        this.tipss = [];
        this._categories = this.populateCategories();
        this._lastCategory = 'default';
    }
    PHTipsBook.prototype.constructor = PHTipsBook;

    /* Populates the categories */
    PHTipsBook.prototype.populateCategories = function() {
        var categories = { 'default': { name: PHPlugins.Params.PHTipsTextDefault, icon: PHPlugins.Params.PHTipsIconDefault } };
        if (PHPlugins.Params.PHTipsCategoryId.trim() != '') {
            var ids = PHPlugins.Params.PHTipsCategoryId.split(',');
            var names = PHPlugins.Params.PHTipsCategoryTexts.split(',');
            var icons = PHPlugins.Params.PHTipsCategoryIcons.split(',');

            for (var i = 0; i < ids.length; i++) {
                ids[i] = ids[i].trim();

                // Name
                if (typeof names[i] != 'undefined') {
                    names[i] = names[i].trim();
                } else {
                    names[i] = PHPlugins.Params.PHTipsTextDefault + ' - ' + i;
                }

                // Icon
                if (typeof icons[i] != 'undefined') {
                    icons[i] = icons[i].trim();
                } else {
                    icons[i] = PHPlugins.Params.PHTipsIconDefault;
                }

                // Adding the category
                categories[ids[i]] = { name: names[i], icon: icons[i] };
            }

        }
        return categories;
    };

    /* Gets the Common Event for tipss */
    PHTipsBook.prototype.getPHTipsCommonEvent = function() {

        var tipsVar = null;

        if ($dataCommonEvents) {
            for (var i = 0; i < $dataCommonEvents.length; i++) {
                if ($dataCommonEvents[i] instanceof Object && $dataCommonEvents[i].name == "PHTipsBook") {
                    tipsVar = $dataCommonEvents[i].list;
                    i = $dataCommonEvents.length;
                }
            }
        }

        if (tipsVar != null) {
            this.populateListOfTipss(tipsVar);
        }

    };

    /* Populates the tips list */
    PHTipsBook.prototype.populateListOfTipss = function(tipsVar) {
        var str = '';
        var index = -1;
        var header;
        var checkPage;
        var descriptionIndex = 0;
        this.tipss = [];

        for (var i = 0; i < tipsVar.length; i++) {
            if (typeof tipsVar[i].parameters[0] !== 'undefined') {
                str = tipsVar[i].parameters[0].trim();
                if (this.checkTitle(str)) {
                    header = this.separateTitleAndType(str);
                    this.tipss.push(
                        {
                            title: header[0],
                            icon: header[1],
                            type: header[2],
                            descriptions: [''],
                            reward: [],
                            updates: 0,
                            active: false
                        }
                    );
                    descriptionIndex = 0;
                    index++;
                } else if (this.tipss[index]) {
                    str = this.replaceVariants(str);
                    checkPage = this.checkPageBreak(str);
                    if (checkPage == 0) {
                        this.tipss[index].descriptions[descriptionIndex] += str + '\n';
                    } else if (checkPage == 1) {
                        descriptionIndex++;
                        this.tipss[index].descriptions[descriptionIndex] = '';
                    }
                }
            }
        }
    };

    /* Replaces the variant tags for enemies, items, etc */
    PHTipsBook.prototype.replaceVariants = function(str) {

        var variants = ['enemy', 'item', 'weapon', 'armor', 'actor', 'skill'];
        var variantIndex = -1;

        var originalStr = '';
        var regex = /\<(.*?)\>/g;
        var matches = null;

        while ((matches = regex.exec(str)) != null) {
            originalStr = matches[0];
            matches = matches[1];
            matches = matches.split(':');
            variantIndex = variants.indexOf(matches[0]);
            if (variantIndex > -1 && typeof matches[1] !== 'undefined') {
                str = str.replace(originalStr, this.getVariantName(variants[variantIndex], parseInt(matches[1])));
            }
        }

        return str;

    };

    /* Gets the real name of the variant */
    PHTipsBook.prototype.getVariantName = function(type, id) {
        switch (type) {
            case 'enemy':
                return (typeof $dataEnemies[id] !== 'undefined' ? $dataEnemies[id].name : '');
                break;
            case 'item':
                return (typeof $dataItems[id] !== 'undefined' ? $dataItems[id].name : '');
                break;
            case 'weapon':
                return (typeof $dataWeapons[id] !== 'undefined' ? $dataWeapons[id].name : '');
                break;
            case 'armor':
                return (typeof $dataArmors[id] !== 'undefined' ? $dataArmors[id].name : '');
                break;
            case 'actor':
                return (typeof $dataActors[id] !== 'undefined' ? $dataActors[id].name : '');
                break;
            case 'skill':
                return (typeof $dataSkills[id] !== 'undefined' ? $dataSkills[id].name : '');
                break;
        }
    };

    /* Checks if the string is a title or a description */
    PHTipsBook.prototype.checkTitle = function(str) {
        if (str.charAt(0) == "{" && str.charAt(str.length - 1) == "}") {
            return true;
        }
        return false;
    };

    /* Checks if the string is a break page */
    PHTipsBook.prototype.checkPageBreak = function(str) {
        if (str.indexOf('[break-on-update]') > -1) {
            return 1;
        }
        return 0;
    };

    /* Separates the title from the type of the tips */
    PHTipsBook.prototype.separateTitleAndType = function(str) {

        var regExpTitle = /\{([^)]+)\}/;
        var matches = regExpTitle.exec(str);

        var title;
        var icon;
        var category;

        if (matches == null) {
            icon = PHPlugins.Params.PHTipsIconDefault;
            category = 'default';
            title = '';
        } else {
            matches[1] = matches[1].trim();
            title = matches[1].split('|');
            if (typeof title[1] != 'undefined' && title[1].trim() != '' && typeof this._categories[title[1].trim()] != 'undefined') {
                category = title[1].trim();
                if (typeof title[2] != 'undefined' && title[2].trim() != '') {
                    icon = title[2].trim();
                } else {
                    icon = this._categories[category].icon;
                }
            } else {
                category = 'default';
                icon = PHPlugins.Params.PHTipsIconDefault;
            }
            title = title[0].trim();
        }

        return [
            title, icon, category
        ];

    };

    /* Toggle the tips according to the title */
    PHTipsBook.prototype.toggleTips = function(title, toggle) {
        for (var i = 0; i < this.tipss.length; i++) {
            if (this.tipss[i].title == title) {
                this.tipss[i].active = toggle;
                i = this.tipss.length;
            }
        }
    };

    /* Updates the tips to show more instructions */
    PHTipsBook.prototype.updateTips = function(title) {
        for (var i = 0; i < this.tipss.length; i++) {
            if (this.tipss[i].title == title) {
                if (this.tipss[i].updates + 1 <= this.tipss[i].descriptions.length - 1) {
                    this.tipss[i].updates = this.tipss[i].updates + 1;
                    i = this.tipss.length;
                }
            }
        }
    };

    /* Get the quantity of tipss for the category menu */
    PHTipsBook.prototype.getQuantityTipss = function() {
        var counter = {};
        for (var val in this._categories) {
            if (this._categories.hasOwnProperty(val)) {
                counter[val] = { qtty: 0, name: this._categories[val].name };
            }
        }
        for (var i = 0; i < this.tipss.length; i++) {
            if (this.tipss[i].active) {
                counter[this.tipss[i].type].qtty++;
            }
        }
        return counter;
    };

    /* Get the tipss for the list */
    PHTipsBook.prototype.getAvailableTipss = function() {
        var tipss = [];
        for (var i = 0; i < this.tipss.length; i++) {
            if (this.tipss[i].active && this.tipss[i].type == this._lastCategory) {
                tipss.push( { tips: this.tipss[i], _index: i } );
            }
        }
        return tipss;
    };

    /* Get the full description of a tips */
    PHTipsBook.prototype.getFullDescription = function(index) {
        if (typeof this.tipss[index] !== 'undefined' && typeof this.tipss[index].descriptions[this.tipss[index].updates] !== 'undefined') {
            var str = '';
            str += this.tipss[index].descriptions[this.tipss[index].updates];
            for (var i = this.tipss[index].updates - 1; i >= 0; i--) {
                str += '\n\n' + this.tipss[index].descriptions[i];
            }
            return str;
        }
        return '';
    };

    /* Get the quantity of pages to draw */
    PHTipsBook.prototype.getQuantityPages = function(index) {
        if (typeof this.tipss[index] !== 'undefined') {
            if (this.tipss[index].updates.length == 0) {
                return this.tipss[index].descriptions.length;
            } else {
                return this.tipss[index].updates[0];
            }
        }
        return 0;
    };

    /* Clear tipss */
    PHTipsBook.prototype.clearTipss = function() {
        for (var i = 0; i < PHPlugins.PHTipss.tipss.length; i++) {
            PHPlugins.PHTipss.tipss[i].active = false;
        }
    };

    /* Changes the category of a tips with the given term (Title of the Tips|category) */
    PHTipsBook.prototype.changeTipsCategory = function(term) {
        term = term.split('|');
        if (term.length == 2) {
            term[0] = term[0].trim();
            term[1] = term[1].trim();
            for (var i = 0; i < this.tipss.length; i++) {
                if (this.tipss[i].title == term[0] && typeof this._categories[term[1]] != 'undefined') {
                    this.tipss[i].icon = PHPlugins.Params.PHTipsIconCompleted;
                    this.tipss[i].type = term[1];
                    i = this.tipss.length;
                }
            }
        }
    };

    /* Gets the index of the tips title */
    PHTipsBook.prototype.findIndex = function(title) {
        for (var i = 0; i < this.tipss.length; i++) {
            if (title == this.tipss[i].title) {
                return i;
            }
        }
        return -1;
    };

    /* Gets the symbol for the category */
    PHTipsBook.prototype.getIconForCategory = function(symbol) {
        if (typeof this._categories[symbol] != 'undefined') {
            return this._categories[symbol].icon;
        }
        return PHPlugins.Params.PHTipsIconDefault;
    };

    /* Checks if a tips is active */
    PHTipsBook.prototype.isActive = function(title) {
        var index = this.findIndex(title);
        if (index > -1 && this.tipss[index].active) {
            return true;
        }
        return false;
    };

    /* Checks if a tips has a particular category */
    PHTipsBook.prototype.is = function(title, category) {
        var index = this.findIndex(title);
        if (index > -1 && this.tipss[index].type == category) {
            return true;
        }
        return false;
    };


    /* ---------------------------------------------------------- *
     *                 GAME INTERPRETER PROCESS                   *
     * ---------------------------------------------------------- */


    var getAllArguments = function(args) {
        var str = args[1].toString();
        for (var i = 2; i < args.length; i++) {
            str += ' ' + args[i].toString();
        }
        return str;
    };

    /*
     * Turn tipss on and off via Plugin Command
     */
    var _Game_Interpreter_pluginCommand = Game_Interpreter.prototype.pluginCommand;
    Game_Interpreter.prototype.pluginCommand = function(command, args) {
        _Game_Interpreter_pluginCommand.call(this, command, args);
        if (command === 'PHTipsBook') {
            switch (args[0]) {
                case 'add':
                    PHPlugins.PHTipss.toggleTips(getAllArguments(args), true);
                    break;
                case 'remove':
                    PHPlugins.PHTipss.toggleTips(getAllArguments(args), false);
                    break;
                case 'clear':
                    PHPlugins.PHTipss.clearTipss();
                    break;
                case 'show':
                    SceneManager.push(Scene_TipsBook);
                    break;
                case 'change':
                    PHPlugins.PHTipss.changeTipsCategory(getAllArguments(args));
                    break;
                case 'update':
                    PHPlugins.PHTipss.updateTips(getAllArguments(args));
                    break;
            }
        }
    };


    /* ---------------------------------------------------------- *
     *                      LOADING PROCESS                       *
     * ---------------------------------------------------------- */

    /* Creating PHTipss when creating objects */
    var _DataManager_createGameObjects_ = DataManager.createGameObjects;
    DataManager.createGameObjects = function() {
        _DataManager_createGameObjects_.call(this);
        if (typeof $dataCommonEvents !== "undefined") {
            PHPlugins.PHTipss = new PHTipsBook();
            PHPlugins.PHTipss.getPHTipsCommonEvent();
        }
    };

    /*
     * Populating PHTipss variable after loading the whole database
     */
    var _DataManager_onLoad_ = DataManager.onLoad;
    DataManager.onLoad = function(object) {
        _DataManager_onLoad_.call(this, object);
        if (object === $dataCommonEvents) {
            if (PHPlugins.PHTipss == null) {
                PHPlugins.PHTipss = new PHTipsBook();
                PHPlugins.PHTipss.getPHTipsCommonEvent();
            }
        }
    };

    /* Saves the tipss when the player saves the game */
    var _DataManager_makeSaveContents_ = DataManager.makeSaveContents;
    DataManager.makeSaveContents = function() {
        var contents = _DataManager_makeSaveContents_.call(this);
        contents.tipss = PHPlugins.PHTipss.tipss;
        return contents;
    };

    /* Retrieve the tipss from the save content */
    var _DataManager_extractSaveContents_ = DataManager.extractSaveContents;
    DataManager.extractSaveContents = function(contents) {
        _DataManager_extractSaveContents_.call(this, contents);
        PHPlugins.PHTipss = new PHTipsBook();
        PHPlugins.PHTipss.tipss = contents.tipss;
    };

})();

/* ---------------------------------------------------------- *
 *                        MENU PROCESS                        *
 * ---------------------------------------------------------- */

/*
 * Creates an icon on the menu for accessing the tips book
 * It's compatible with Yanfly Main Menu Manager as well
 */
if (PHPlugins.Params.PHTipsAddToMenu == 1 && (typeof Yanfly === "undefined" || typeof Yanfly.MMM === "undefined")) {
    var Window_MenuCommand_prototype_addOriginalCommands = Window_MenuCommand.prototype.addOriginalCommands;
    Window_MenuCommand.prototype.addOriginalCommands = function () {
        Window_MenuCommand_prototype_addOriginalCommands.call(this);
        this.addCommand(PHPlugins.Params.PHTipsMenuText, 'tipsbook');
    };
    var _Scene_Menu_prototype_createCommandWindow = Scene_Menu.prototype.createCommandWindow;
    Scene_Menu.prototype.createCommandWindow = function () {
        _Scene_Menu_prototype_createCommandWindow.call(this);
        this._commandWindow.setHandler('tipsbook', function () {
            SceneManager.push(Scene_TipsBook);
        });
    };
}

/* ---------------------------------------------------------- *
 *                       WINDOW PROCESS                       *
 * ---------------------------------------------------------- */

/*
 * WINDOW QUEST BOOK TITLE
 */
function Window_TipsBookTitle() {
    this.initialize.apply(this, arguments);
}
Window_TipsBookTitle.prototype = Object.create(Window_Base.prototype);
Window_TipsBookTitle.prototype.constructor = Window_TipsBookTitle;

Window_TipsBookTitle.prototype.initialize = function() {
    Window_Base.prototype.initialize.call(this, 0, 0, Graphics.boxWidth, this.fittingHeight(1));
    if (isNaN(parseInt(PHPlugins.Params.PHTipsTextTitleColor))) {
        PHPlugins.Params.PHTipsTextTitleColor = 0;
    }
    this.refresh();
};

Window_TipsBookTitle.prototype.refresh = function() {
    this.contents.clear();
    this.changeTextColor(this.textColor(PHPlugins.Params.PHTipsTextTitleColor));
    this.drawText(PHPlugins.Params.PHTipsTextTitle, 0, 0, Graphics.boxWidth, "center");
};


/*
 * WINDOW QUEST BOOK CATEGORY
 */
function Window_TipsBookCategory() {
    this.initialize.apply(this, arguments);
}
Window_TipsBookCategory.prototype = Object.create(Window_Command.prototype);
Window_TipsBookCategory.prototype.constructor = Window_TipsBookCategory;

Window_TipsBookCategory.prototype.initialize = function() {
    Window_Command.prototype.initialize.call(this, 0, this.fittingHeight(1));
    this._tipsQuantity = PHPlugins.PHTipss.getQuantityTipss();
    this.select(0);
};

Window_TipsBookCategory.prototype.setListWindow = function(window) {
    this._listWindow = window;
};

Window_TipsBookCategory.prototype.setTipsCategory = function() {
    PHPlugins.PHTipss._lastCategory = this.currentSymbol() || 'default';
};

Window_TipsBookCategory.prototype.maxCols = function() {
    return 1;
};

Window_TipsBookCategory.prototype.windowWidth = function() {
    return parseInt((Graphics.boxWidth * 2) / 6);
};

Window_TipsBookCategory.prototype.windowHeight = function() {
    return Graphics.boxHeight - this.fittingHeight(1);
};

Window_TipsBookCategory.prototype.makeCommandList = function() {
    this._tipsQuantity = this._tipsQuantity || PHPlugins.PHTipss.getQuantityTipss();
    var added = false;
    for (var val in this._tipsQuantity) {
        if (this._tipsQuantity.hasOwnProperty(val) && this._tipsQuantity[val].qtty > 0) {
            this.addCommand(this._tipsQuantity[val].name, val, true);
            added = true;
        }
    }

    if (!added) {
        this.addCommand(PHPlugins.Params.PHTipsTextNoTips, 'notips', false);
    }
};

Window_TipsBookCategory.prototype.drawItem = function(index) {
    var rect = this.itemRectForText(index);
    var align = 'left';
    this.resetTextColor();

    var iconWidth = Window_Base._iconWidth + 3;
    if (PHPlugins.Params.PHTipsDisplayIcon == 1 && this.findSymbol('notips') == -1) {
        this.drawIcon(PHPlugins.PHTipss.getIconForCategory(this.commandSymbol(index)), rect.x, rect.y + 2);
    } else {
        iconWidth = 0;
    }

    this.changePaintOpacity(this.isCommandEnabled(index));
    this.drawText(this.commandName(index), rect.x + iconWidth, rect.y, rect.width - iconWidth, align);
};

Window_TipsBookCategory.prototype.itemTextAlign = function() {
    return 'center';
};

Window_TipsBookCategory.prototype.refresh = function() {
    Window_Command.prototype.refresh.call(this);
};

Window_TipsBookCategory.prototype.update = function() {
    Window_Command.prototype.update.call(this);
    this.setTipsCategory();
    this._listWindow.refresh();
};




/*
 * WINDOW QUEST BOOK DETAILS
 */
function Window_TipsBookDetails() {
    this.initialize.apply(this, arguments);
}

Window_TipsBookDetails.prototype = Object.create(Window_Selectable.prototype);
Window_TipsBookDetails.prototype.constructor = Window_TipsBookDetails;

Window_TipsBookDetails.prototype.initialize = function() {

    this._tipsPage = 0;
    this._lastTotalPages = 0;
    var height = this.fittingHeight(1);

    var categoryDistance = parseInt((Graphics.boxWidth * 2) / 6);
    Window_Selectable.prototype.initialize.call(this, categoryDistance, height, Graphics.boxWidth - categoryDistance, Graphics.boxHeight - height);

};

Window_TipsBookDetails.prototype.setTipsIndex = function(index) {
    this._tipsIndex = index;
};

Window_TipsBookDetails.prototype.setTipsPage = function(page) {
    this._tipsPage = page;
};

Window_TipsBookDetails.prototype.refresh = function() {
    this.contents.clear();
    this.changeTextColor(this.systemColor());
    if (this._tipsIndex > -1) {
        this.drawTipsTextEx(PHPlugins.PHTipss.getFullDescription(this._tipsIndex), 0, 0);
    }
};

Window_TipsBookDetails.prototype.drawTipsTextEx = function(text, x, y) {
    if (text) {
        var textState = { index: 0, x: x, y: y, left: x };
        textState.text = this.convertEscapeCharacters(this.verifyFontSize(text));
        textState.height = this.calcTextHeight(textState, false);
        textState.y -= this._tipsPage * textState.height;
        textState.text = this.formatTips(textState.text, textState.height);
        this.resetFontSettings();
        while (textState.index < textState.text.length) {
            this.processCharacter(textState);
        }
        return textState.x - x;
    } else {
        return 0;
    }
};

Window_TipsBookDetails.prototype.formatTips = function(text, height) {

    var tips = text;
    var finalText = '';

    var totalSize = 0;
    var textWidth = 0;
    var btmWidth = this.contentsWidth();
    var spaceWidth = this.textWidth(' ');

    var totalPages = 0;
    var totalHeight = 0;
    var btmHeight = this.contentsHeight();

    tips = tips.split(' ');
    for (var i = 0; i < tips.length; i++) {
        if (tips[i].indexOf('\n') == -1) {
            textWidth = this.textWidth(tips[i]);
            if (totalSize + textWidth <= btmWidth) {
                finalText += tips[i] + ' ';
                totalSize += textWidth + spaceWidth;
            } else {
                finalText += '\n';
                finalText += tips[i] + ' ';
                totalSize = textWidth + spaceWidth;
                totalHeight += height;
                if (totalHeight > btmHeight) totalPages++;
            }
        } else {
            tips[i] = tips[i].split('\n');
            for (var j = 0; j < tips[i].length; j++) {
                textWidth = this.textWidth(tips[i][j]);
                if (totalSize + textWidth > btmWidth) {
                    finalText += '\n';
                    totalSize = 0;
                    totalHeight += height;
                    if (totalHeight > btmHeight) totalPages++;
                }
                finalText += tips[i][j] + ' ';
                totalSize += textWidth + spaceWidth;
                if (j + 1 < tips[i].length) {
                    finalText += '\n';
                    totalSize = textWidth + spaceWidth;
                    totalHeight += height;
                    if (totalHeight > btmHeight) totalPages++;
                }
            }
        }
    }

    this._lastTotalPages = totalPages;
    return finalText;

};

Window_TipsBookDetails.prototype.verifyFontSize = function(text) {
    return text.replace(/\\{/g, '').replace(/\\}/g, '');
};

Window_TipsBookDetails.prototype.allowPageUp = function() {
    return this._tipsPage > 0;
};

Window_TipsBookDetails.prototype.allowPageDown = function() {
    if (this._tipsPage < this._lastTotalPages) {
        return true;
    }
    return false;
};

Window_TipsBookDetails.prototype.updateArrows = function() {
    this.downArrowVisible = this.allowPageDown();
    this.upArrowVisible = this.allowPageUp();
};

Window_TipsBookDetails.prototype.isCursorMovable = function() {
    return this.isOpenAndActive();
};

Window_TipsBookDetails.prototype.processWheel = function() {
    if (this.isOpenAndActive()) {
        var threshold = 10;
        if (TouchInput.wheelY >= threshold) {
            this.cursorDown();
        }
        if (TouchInput.wheelY <= -threshold) {
            this.cursorUp();
        }
    }
};

Window_TipsBookDetails.prototype.cursorDown = function() {
    if (this.allowPageDown()) {
        SoundManager.playCursor();
        this._tipsPage++;
        this.refresh();
    }
};

Window_TipsBookDetails.prototype.cursorUp = function() {
    if (this.allowPageUp()) {
        SoundManager.playCursor();
        this._tipsPage--;
        this.refresh();
    }
};

Window_TipsBookDetails.prototype.cursorPagedown = function() {
    this.cursorDown();
};

Window_TipsBookDetails.prototype.cursorPageup = function() {
    this.cursorUp();
};



/*
 * WINDOW QUEST BOOK LIST
 */
function Window_TipsBookList() {
    this.initialize.apply(this, arguments);
}

Window_TipsBookList.prototype = Object.create(Window_Selectable.prototype);
Window_TipsBookList.prototype.constructor = Window_TipsBookList;

Window_TipsBookList.prototype.initialize = function() {

    this._tipsList = [];
    var categoryDistance = parseInt((Graphics.boxWidth * 2) / 6);
    var height = this.fittingHeight(1);
    Window_Selectable.prototype.initialize.call(this, categoryDistance, height, Graphics.boxWidth - categoryDistance, Graphics.boxHeight - height);

    this.refresh();
};

Window_TipsBookList.prototype.setDetailWindow = function(window) {
    this._detailWindow = window;
};

Window_TipsBookList.prototype.maxItems = function() {
    return this._tipsList.length;
};

Window_TipsBookList.prototype.refresh = function() {
    Window_Selectable.prototype.refresh.call(this);
    this.drawTipsList();
};

Window_TipsBookList.prototype.update = function() {
    Window_Selectable.prototype.update.call(this);
    if (this.index() > -1) {
        this._detailWindow.setTipsIndex(this._tipsList[this.index()]._index);
    } else {
        this._detailWindow.setTipsIndex(-1);
    }
    this._detailWindow.refresh();
};

Window_TipsBookList.prototype.drawTipsList = function() {
    this._tipsList = PHPlugins.PHTipss.getAvailableTipss();
    for (var i = 0; i < this._tipsList.length; i++) {
        this.drawTips(this._tipsList[i].tips, i);
    }
};

Window_TipsBookList.prototype.drawTips = function(tips, index) {

    var title = tips.title;
    var rect = this.itemRectForText(index);

    var iconWidth = Window_Base._iconWidth + 3;
    if (PHPlugins.Params.PHTipsDisplayIcon == 1) {
        this.drawIcon(tips.icon, rect.x, rect.y + 2);
    } else {
        iconWidth = 0;
    }

    var width = rect.width - this.textPadding() - iconWidth;
    this.drawText(title, rect.x + iconWidth, rect.y, width);
};


/* ---------------------------------------------------------- *
 *                        SCENE PROCESS                       *
 * ---------------------------------------------------------- */

/*
 * Create the scene of the tips book
 */
function Scene_TipsBook() {
    this.initialize.apply(this, arguments);
}

Scene_TipsBook.prototype = Object.create(Scene_MenuBase.prototype);
Scene_TipsBook.prototype.constructor = Scene_TipsBook;

Scene_TipsBook.prototype.initialize = function() {
    Scene_MenuBase.prototype.initialize.call(this);
};

Scene_TipsBook.prototype.create = function() {
    Scene_MenuBase.prototype.create.call(this);

    this.createWindowDetail();
    this.createWindowList();
    this.createWindowCategory();
    this.createWindowTitle();
    this.changeWindowsOpacity();

};

if (PHPlugins.Params.PHTipsBackgroundImage != '') {
    Scene_TipsBook.prototype.createBackground = function () {
        this._backgroundSprite = new Sprite();
        this._backgroundSprite.bitmap = ImageManager.loadPicture(PHPlugins.Params.PHTipsBackgroundImage);
        this.addChild(this._backgroundSprite);
    };
}

Scene_TipsBook.prototype.createWindowCategory = function() {
    this._categoryWindow = new Window_TipsBookCategory();
    this._categoryWindow.setHandler('cancel', this.popScene.bind(this));
    this._categoryWindow.setHandler('ok', this.onCategoryOk.bind(this));
    this._categoryWindow.setListWindow(this._listWindow);
    this.addWindow(this._categoryWindow);
};

Scene_TipsBook.prototype.createWindowList = function() {
    this._listWindow = new Window_TipsBookList();
    this._listWindow.setHandler('cancel', this.onListCancel.bind(this));
    this._listWindow.setHandler('ok', this.onListOk.bind(this));
    this._listWindow.setDetailWindow(this._detailWindow);
    this.addWindow(this._listWindow);
};

Scene_TipsBook.prototype.createWindowDetail = function() {
    this._detailWindow = new Window_TipsBookDetails();
    this._detailWindow.setHandler('cancel', this.onDetailCancel.bind(this));
    this.addWindow(this._detailWindow);
};

Scene_TipsBook.prototype.createWindowTitle = function() {
    this._titleWindow = new Window_TipsBookTitle();
    this.addWindow(this._titleWindow);
};

Scene_TipsBook.prototype.changeWindowsOpacity = function() {
    if (PHPlugins.Params.PHTipsBackgroundImage != '') {
        this._categoryWindow.opacity = 0;
        this._listWindow.opacity = 0;
        this._detailWindow.opacity = 0;
        this._titleWindow.opacity = 0;
    }
};

Scene_TipsBook.prototype.onCategoryOk = function() {
    this._detailWindow._tipsPage = 0;
    this._categoryWindow.setTipsCategory();
    this._categoryWindow.deactivate();
    this._listWindow.select(0);
    this._listWindow.activate();
};

Scene_TipsBook.prototype.onListCancel = function() {
    this._listWindow.deselect();
    this._listWindow.deactivate();
    this._categoryWindow.activate();
};

Scene_TipsBook.prototype.onListOk = function() {
    this._listWindow.deactivate();
    this._listWindow.hide();
    this._detailWindow.show();
    this._detailWindow.activate();
};

Scene_TipsBook.prototype.onDetailCancel = function() {
    this._detailWindow._tipsPage = 0;
    this._detailWindow.deactivate();
    this._detailWindow.hide();
    this._listWindow.show();
    this._listWindow.activate();
};