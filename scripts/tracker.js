const imageDir = 'images/';

var disableMap = false;
var currentGeneralLocation = '';
var currentDetailedLocation = '';
var currentLocationIsDungeon = false;
var showNonProgressLocations = false;
var singleColorBackground = false;
var hideLocationLogic = false;

function toggleNonProgressLocations(button) {
    showNonProgressLocations = !showNonProgressLocations;
    if (showNonProgressLocations) {
        button.innerText = 'Hide Non-Progress Locations';
    } else {
        button.innerText = 'Show Non-Progress Locations';
    }

    if (document.getElementById('zoommap').style.display == 'block') {
        if (currentLocationIsDungeon) {
            toggleMap(dungeons.indexOf(currentGeneralLocation), true);
        } else {
            toggleMap(islands.indexOf(currentGeneralLocation), false);
        }
    }
    dataChanged();
}

function toggleSingleColorBackground(button) {
    singleColorBackground = !singleColorBackground;
    if (singleColorBackground) {
        $('.canUseSingleColor').addClass('single-color');
        button.innerText = 'Hide Single Color Background';
    } else {
        $('.canUseSingleColor').removeClass('single-color');
        button.innerText = 'Show Single Color Background';
    }
}

function toggleLocationLogic(button) {
    hideLocationLogic = !hideLocationLogic;
    if (hideLocationLogic) {
        button.innerText = 'Show Location Logic';
        $('.requireLocationLogic').addClass('hide');
    } else {
        button.innerText = 'Hide Location Logic';
        $('.requireLocationLogic').removeClass('hide');
    }
    dataChanged();
}

function refreshAllImagesAndCounts() {
    // bosses
    var bosses = [];
    bosses[0] = locationsChecked['Dragon Roost Cavern']['Gohma Heart Container'];
    bosses[1] = locationsChecked['Forbidden Woods']['Kalle Demos Heart Container'];
    bosses[2] = locationsChecked['Tower of the Gods']['Gohdan Heart Container'];
    bosses[3] = locationsChecked['Forsaken Fortress']['Helmaroc King Heart Container'];
    bosses[4] = locationsChecked['Earth Temple']['Jalhalla Heart Container'];
    bosses[5] = locationsChecked['Wind Temple']['Molgera Heart Container'];
    bosses[6] = locationsChecked["Ganon's Tower"]['Defeat Ganondorf'];

    for (var i = 0; i < bosses.length; i++) {
        var l = 'extralocation' + i.toString();
        if (bosses[i]) {
            document.getElementById(l).src = imageDir + 'boss' + i + '_d.png';
        } else {
            document.getElementById(l).src = imageDir + 'boss' + i + '.png';
        }
    }

    // triforce pieces
    var shardCount = items['Triforce Shard'];
    document.getElementById('triforce').src = imageDir + 'triforce' + shardCount + '.png'

    // items
    for (var i = 0; i <= 31; i++) {
        var l = 'item' + i.toString();
        var itemName = document.getElementById(l).name;
        var itemCount = items[itemName];

        if (itemCount === 0) {
            document.getElementById(l).src = imageDir + 'item' + i + '.png'
        } else if (itemCount === 1) {
            document.getElementById(l).src = imageDir + 'item' + i + '_a.png'
        } else {
            document.getElementById(l).src = imageDir + 'item' + i + '_' + itemCount + '_a.png'
        }
    }

    // sword mode
    if (swordMode == 'swordless') {
        var swordElement = document.getElementById('item21');
        swordElement.classList.add('hide');
        var hurricaneSpinElement = document.getElementById('item30');
        hurricaneSpinElement.classList.add('hide');
    }

    // shields
    var l = 'shield';
    if (items['Mirror Shield'] > 0) {
        document.getElementById(l).src = imageDir + 'mirrorshield.png'
    } else if (items["Hero's Shield"] > 0) {
        document.getElementById(l).src = imageDir + 'herosshield.png'
    } else {
        document.getElementById(l).src = imageDir + 'noshield.png'
    }

    // songs
    for (var i = 0; i < 6; i++) {
        var l = 'song' + i.toString();
        var songName = document.getElementById(l).name;

        if (items[songName] === 0) {
            document.getElementById(l).src = imageDir + 'song' + i + '.png'
        } else
            document.getElementById(l).src = imageDir + 'song' + i + '_a.png'
    }

    // pearls
    for (var i = 0; i < 3; i++) {
        var l = 'pearl' + i.toString();
        var pearlName = document.getElementById(l).name;

        if (items[pearlName] === 0) {
            document.getElementById(l).src = imageDir + 'pearl' + i + '.png'
        } else
            document.getElementById(l).src = imageDir + 'pearl' + i + '_a.png'
    }

    for (var i = 0; i < dungeons.length; i++) {
        if (isMainDungeon(dungeons[i])) {
            // small keys
            var l = 'smallkey' + i.toString();
            var smallKeyName = document.getElementById(l).innerText;
            var smallKeyCount = keys[smallKeyName];
            if (smallKeyCount === 0) {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'smallkey.png\')';
            } else {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'smallkey_' + smallKeyCount + '.png\')';
            }

            // dungeon entry
            var l = 'entry' + i.toString();
            if (isRandomEntrances) {
                var entryName = document.getElementById(l).innerText;
                if (items[entryName] === 0) {
                    document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'dungeon_noentry.png\')';
                } else {
                    document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'dungeon_entered.png\')';
                }
            } else {
                document.getElementById(l).style.display = 'none';
            }

            // boss keys
            var l = 'bosskey' + i.toString();
            var bigKeyName = document.getElementById(l).innerText;
            var bigKeyCount = keys[bigKeyName];
            if (bigKeyCount === 0) {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'bosskey.png\')';
            } else {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'bosskey_a.png\')';
            }
        }

        if (dungeons[i] != "Ganon's Tower") {
            // maps
            var l = 'dungeonmap' + i.toString();
            var mapName = document.getElementById(l).innerText;
            var mapCount = items[mapName];
            if (mapCount === 0) {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'map.png\')';
            } else {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'map_a.png\')';
            }

            // compasses
            var l = 'compass' + i.toString();
            var compassName = document.getElementById(l).innerText;
            var compassCount = items[compassName];
            if (compassCount === 0) {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'compass.png\')';
            } else {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'compass_a.png\')';
            }
        }
    }

    // charts
    for (var i = 0; i < charts.length; i++) {
        var l = 'chart' + i.toString();
        var chartName = charts[i];
        var chartCount = items[chartName];
        if (!isRandomCharts && chartName.includes('Triforce')) {
            if (chartCount === 1) {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'triforcechartopen.png\')';
            } else {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'triforcechart.png\')';
            }
        }
        else {
            if (chartCount === 1) {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'chartopen.png\')';
            } else {
                document.getElementById(l).style.backgroundImage = 'url(\'' + imageDir + 'chart.png\')';
            }
        }
    }

    // locations
    for (var i = 0; i < islands.length; i++) {
        var l = 'mapchests' + i.toString();
        var chests = getChestCountsForLocation(islands[i], false);
        setChestsForElement(document.getElementById(l), chests.progress, chests.available, chests.total);
    }
    for (var i = 0; i < dungeons.length; i++) {
        var l = 'dungeonchests' + i.toString();
        var chests = getChestCountsForLocation(dungeons[i], true);
        setChestsForElement(document.getElementById(l), chests.progress, chests.available, chests.total);
    }
}

function setChestsForElement(element, progress, available, total) {
    if (hideLocationLogic) {
        element.innerHTML = total;
    } else {
        element.innerHTML = available + '/' + total;
    }
    if (total === 0) {
        setElementColor(element, 'black-text');
    } else {
        if (available === 0) {
            setElementColor(element, 'red-text');
        } else {
            if (progress === 0) {
                setElementColor(element, 'yellow-text');
            } else {
                setElementColor(element, 'blue-text');
            }
        }
    }
}

function setElementColor(element, color) {
    element.classList.remove('black-text');
    element.classList.remove('red-text');
    element.classList.remove('yellow-text');
    element.classList.remove('blue-text');
    element.classList.add(color);
}

function clearItemInfo() {
    document.getElementById('item-info').innerText = '';
}

function itemInfo(element) {
    var text = element.name;
    if (text.startsWith('Progressive')) {
        var itemCount = items[text];
        var textWithCount = text + ' x' + itemCount;
        text = getNameForItem(textWithCount);
    } else if (text == "Hero's Shield") {
        if (items['Mirror Shield'] == 1) {
            text = 'Mirror Shield';
        }
    } else if (text == 'Triforce Shard') {
        var shardCount = items['Triforce Shard'];
        if (shardCount == 8) {
            text = 'Triforce of Courage';
        } else {
            text = 'Triforce Shard (' + shardCount + '/8)';
        }
    } else if (text == 'Empty Bottle') {
        var itemCount = items[text];
        text = 'Empty Bottle (' + itemCount + '/4)';
    } else if (text == 'Tingle Statue') {
        var itemCount = items[text];
        text = 'Tingle Statue (' + itemCount + '/5)';
    } else {
        text = getNameForItem(text);
    }
    document.getElementById('item-info').innerText = text;
}

function toggleInventoryItem(element, maxItems) {
    var itemName = element.name;
    toggleItem(itemName, maxItems);
    itemInfo(element);
}

function toggleShield(element) {
    incrementShield();
    dataChanged();
    itemInfo(element);
}

function toggleItem(itemName, maxItems) {
    var curCount = items[itemName];
    curCount++;
    if (curCount > maxItems) {
        curCount = 0;
    }
    items[itemName] = curCount;
    if (curCount > 0) {
        setItemToLocation(itemName);
    }
    dataChanged();
}

function setItemToLocation(itemName) {
    if (currentGeneralLocation && currentDetailedLocation) {
        itemsForLocations[currentGeneralLocation][currentDetailedLocation] = itemName;
        $.notify(itemName + " at " + currentDetailedLocation, {
            autoHideDelay: 5000,
            className: 'success',
            position: 'bottom left'
        });
    } else {
        $.notify("Could not set " + itemName, {
            autoHideDelay: 5000,
            className: 'error',
            position: 'bottom left'
        });
    }
}

function toggleKey(element, maxKeys, dungeonIndex) {
    disableMap = true;
    var keyName = element.innerText;
    var keyCount = keys[keyName];
    keyCount++;
    if (keyCount > maxKeys) {
        keyCount = 0;
    }
    keys[keyName] = keyCount;
    if (keyCount > 0) {
        setItemToLocation(keyName);
    }
    dataChanged();
    if (keyName.includes('Small')) {
        smallKeyInfo(element, maxKeys);
    }
    dungeonMapInfo(dungeonIndex);
}

function toggleEntry(element, dungeonIndex) {
    disableMap = true;
    var entryName = element.innerText;
    toggleItem(entryName, 1);
    mapItemInfo(element);
    dungeonMapInfo(dungeonIndex);
}

function shrinkMap() {
    removeVisibleTooltips();
    document.getElementById('chartmap').style.display = 'block';
    document.getElementById('zoommap').style.display = 'none';
    currentGeneralLocation = '';
    recreateTooltips();
}

function getHtmlForItem(itemExpr, isParentExprTrue) {
    var element = document.createElement('span');
    element.innerText = itemExpr.items;
    if (itemExpr.eval) {
        setElementColor(element, 'blue-text');
    } else if (isParentExprTrue) {
        setElementColor(element, 'gray-text');
    } else {
        setElementColor(element, 'red-text');
    }
    return element.outerHTML;
}

function getTextForExpression(expression, isParentExprTrue) {
    var itemsReq = expression.items;
    if (!Array.isArray(itemsReq)) {
        return getHtmlForItem(expression, isParentExprTrue);
    }

    if (expression.type == 'OR') {
        var separator = ' or ';
    } else {
        var separator = ' and ';
    }

    var result = '';
    for (var i = 0; i < itemsReq.length; i++) {
        var curItem = itemsReq[i];
        var subResult = getTextForExpression(curItem, isParentExprTrue || expression.eval);
        if (curItem.type) {
            subResult = '(' + subResult + ')';
        }
        result += subResult;
        if (i < itemsReq.length - 1) {
            result += separator;
        }
    }
    return result;
}

function setTooltipText(generalLocation, detailedLocation) {
    var itemsRequiredExpr = itemsRequiredForLocation(items, generalLocation, detailedLocation);
    if (!itemsRequiredExpr || !itemsRequiredExpr.items || itemsRequiredExpr.items == 'None') {
        var element = document.createElement('span');
        element.innerText = 'None';
        setElementColor(element, 'gray-text');
        $('.tool-tip-text').html(element.outerHTML);
        return;
    }
    if (itemsRequiredExpr.items == 'Impossible') {
        var element = document.createElement('span');
        element.innerText = 'Impossible';
        setElementColor(element, 'red-text');
        $('.tool-tip-text').html(element.outerHTML);
        return;
    }

    if (itemsRequiredExpr.type == 'AND') {
        var itemsRequired = itemsRequiredExpr.items;
    } else {
        var itemsRequired = [itemsRequiredExpr];
    }
    var list = document.createElement('ul');
    for (var i = 0; i < itemsRequired.length; i++) {
        var listItem = document.createElement('li');
        var curItem = itemsRequired[i];
        listItem.innerHTML = getTextForExpression(curItem, curItem.eval);
        list.appendChild(listItem);
    }
    $('.tool-tip-text').html(list.outerHTML);
}

function getLocationName(element) {
    return element.innerText.substring(element.innerText.indexOf(" ") + 1)
}

function addTooltipToElement(element) {
    var detailedLocation = getLocationName(element);
    if (!locationsChecked[currentGeneralLocation][detailedLocation]) {
        setTooltipText(currentGeneralLocation, detailedLocation);
        $(element).qtip({
            content: {
                text: $('.tool-tip-text').clone(),
                title: 'Items Required'
            },
            position: {
                target: 'mouse',
                adjust: {
                    x: 15
                }
            }
        });
    } else if (itemsForLocations[currentGeneralLocation][detailedLocation]) {
        $('.tool-tip-text').html('');
        $(element).qtip({
            content: {
                text: $('.tool-tip-text').clone(),
                title: itemsForLocations[currentGeneralLocation][detailedLocation]
            },
            position: {
                target: 'mouse',
                adjust: {
                    x: 15
                }
            }
        });
    }
}

function addSongTooltip(element) {
    var id = '#' + element.id + '-notes';
    var songName = element.name;
    $(element).qtip({
        content: {
            text: $(id).clone(),
            title: songName
        },
        position: {
            target: 'mouse',
            adjust: {
                x: 15
            }
        }
    });
}

function removeTooltipFromElement(element) {
    $(element).qtip('destroy', true);
}

function recreateTooltips() {
    if (document.getElementById('zoommap').style.display == 'block') {
        removeVisibleTooltips();
        for (var i = 0; i < 36; i++) {
            var l = 'detaillocation' + i.toString();
            var element = document.getElementById(l);
            removeTooltipFromElement(element);
            if (!hideLocationLogic && element.style.display == 'block') {
                addTooltipToElement(element);
            }
        }
    }

    for (var i = 0; i < 6; i++) {
        var l = 'song' + i.toString();
        var element = document.getElementById(l);
        var songName = element.name;

        if (items[songName] === 0) {
            removeTooltipFromElement(element);
        } else {
            addSongTooltip(element)
        }
    }
}

function removeVisibleTooltips() {
    $('.qtip').each(function () {
        var element = $(this);
        if (element.data('qtip')) {
            element.qtip('destroy', true);
            element.removeData('hasqtip');
            element.removeAttr('data-hasqtip');
        }
    });
}

function toggleMap(index, isDungeon) {
    if (disableMap) {
        disableMap = false;
        return;
    }

    document.getElementById('chartmap').style.display = 'none';
    document.getElementById('zoommap').style.display = 'block';

    var zoommapBackground = document.getElementById('zoommap-background');
    if (isDungeon) {
        currentGeneralLocation = dungeons[index];
        currentLocationIsDungeon = true;
        zoommapBackground.style.backgroundImage = 'url(\'' + imageDir + 'dungeon_mapfull' + index + '.png\')';
    } else {
        currentGeneralLocation = islands[index];
        currentLocationIsDungeon = false;
        zoommapBackground.style.backgroundImage = 'url(\'' + imageDir + 'mapfull' + index + '.png\')';
    }

    var detailedLocations = getDetailedLocations(currentGeneralLocation, isDungeon);

    var fontSize = 'normal';
    if (detailedLocations.length > 24) { // 3 columns
        fontSize = 'smallest';
    }
    else if (detailedLocations.length > 12) { // 2 columns
        fontSize = 'small';
    }

    for (var i = 0; i < 36; i++) {
        var l = 'detaillocation' + i.toString();
        var element = document.getElementById(l);
        if (i < detailedLocations.length) {
            element.style.display = 'block';
            element.innerText = "[" + spheres[currentGeneralLocation][detailedLocations[i]] + "] " + detailedLocations[i];
            element.classList.remove('detail-small');
            element.classList.remove('detail-smallest');
            if (fontSize == 'small') {
                element.classList.add('detail-small');
            } else if (fontSize == 'smallest') {
                element.classList.add('detail-smallest');
            }
        } else {
            element.style.display = 'none';
        }
    }

    refreshLocationColors();
    recreateTooltips();
}

function refreshLocationColors() {
    if (currentGeneralLocation.length === 0) {
        return;
    }

    for (var i = 0; i < 36; i++) {
        var l = 'detaillocation' + i.toString();
        var element = document.getElementById(l);
        var detailedLocation = getLocationName(element);
        if (locationsChecked[currentGeneralLocation][detailedLocation]) {
            setElementColor(element, 'black-text');
            element.style.setProperty('text-decoration', 'line-through');
        } else {
            element.style.setProperty('text-decoration', 'none');
            if (locationsAreAvailable[currentGeneralLocation][detailedLocation]) {
                if (locationsAreProgress[currentGeneralLocation][detailedLocation]) {
                    setElementColor(element, 'blue-text');
                } else {
                    setElementColor(element, 'yellow-text');
                }
            } else {
                setElementColor(element, 'red-text');
            }
        }
    }
}

function toggleLocation(element) {
    var detailedLocation = getLocationName(element);
    var newLocationChecked = !locationsChecked[currentGeneralLocation][detailedLocation];
    if (newLocationChecked) {
        currentDetailedLocation = detailedLocation;
    } else {
        itemsForLocations[currentGeneralLocation][detailedLocation] = "";
    }
    locationsChecked[currentGeneralLocation][detailedLocation] = newLocationChecked;
    dataChanged();
}

function clearMapInfo() {
    document.getElementById('map-info').innerText = '';
    document.getElementById('chest-counts').style.visibility = 'hidden';
}

function mapInfo(index) {
    var generalLocation = islands[index];
    var chests = getChestCountsForLocation(generalLocation, false);
    setMapInfoText(generalLocation, chests.available, chests.total);
}

function dungeonMapInfo(index) {
    var generalLocation = dungeons[index];
    var chests = getChestCountsForLocation(dungeons[index], true);
    setMapInfoText(generalLocation, chests.available, chests.total);
}

function setMapInfoText(generalLocation, curAvailable, curTotal) {
    document.getElementById('map-info').innerText = generalLocation;
    document.getElementById('chest-counts').style.visibility = 'visible';
    document.getElementById('chests-total').innerText = curTotal;
    var chestsAvailContainer = document.getElementById('chests-avail-container');
    if (hideLocationLogic) {
        chestsAvailContainer.style.display = 'none';
    } else {
        chestsAvailContainer.style.display = 'inline';
        document.getElementById('chests-avail').innerText = curAvailable;
    }
}

function clearMapItemInfo() {
    document.getElementById('map-item-info').innerText = '';
}

function mapItemInfo(element) {
    document.getElementById('map-item-info').innerText = element.innerText;
}

function smallKeyInfo(element, maxKeys) {
    var keyName = element.innerText;
    var numKeys = keys[keyName];
    document.getElementById('map-item-info').innerText = keyName + ' (' + numKeys + '/' + maxKeys + ')';
}

function toggleChart(index) {
    disableMap = true;
    var chartName = charts[index];
    toggleItem(chartName, 1);
    chartInfo(index);
    mapInfo(index);
}

function chartInfo(index) {
    var chartName = getNameForItem(charts[index]);
    document.getElementById('map-item-info').innerText = chartName;
}
