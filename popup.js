"use strict";

/* set to storage the new user setting value */
function setSaved() {
    let keyName, keyObj;
    let currSetting = $(this);  // $(this) is a div.setting element
    keyName = currSetting.attr("id");
    keyObj = {};
    if (currSetting.hasClass("radios")) {
        keyObj[keyName] = currSetting.find("input:checked").val();
    }
    else if (currSetting.hasClass("color")) {
        keyObj[keyName] = currSetting.find("#lower").val() + "|" + currSetting.find("#upper").val();
    }
    else {
        keyObj[keyName] = (currSetting.find("input").is(":checked")) ? "checked" : "unchecked";
    }
    chrome.storage.sync.set(keyObj, function() {
        console.log("Saved setting.", keyObj);
    });
}

/* asynchonous method to get setting and set setting using closure from the caller getSaved() */
function getKeyValue(keyName, callback, el) {
    chrome.storage.sync.get(keyName, function(keyObj) {
        callback(keyObj, el);
    });
}

/* change the style of the switch that is a child of setting to adhere to the value in storage */
function updateSwitch(keyObj, setting) {
    if (Object.values(keyObj)[0] === "checked") {
        console.log("Got setting: Obj is ", keyObj);
        setting.find("input[type=\"checkbox\"]").prop("checked", true);
    }
    else {
        console.log("Got setting: Obj is ", keyObj);
        setting.find("input[type=\"checkbox\"]").prop("checked", false);
    }
}

/* change the style of the radio that is a child of setting to adhere to the value in storage */
function updateRadio(keyObj, setting) {
    if (setting.find("input[type=\"radio\"]:checked").attr("value") != Object.values(keyObj)[0]) {
        console.log("Got setting: Obj is ", keyObj, "Value is", Object.values(keyObj)[0]);
        setting.find("input[value=\"" + Object.values(keyObj)[0] + "\"]").prop("checked", true);
    }
}

function updateRange(keyObj, setting) {
    if (Object.values(keyObj)[0]) {
        console.log("Got setting: Obj is ", keyObj, "Value is", Object.values(keyObj)[0]);
        let values = Object.values(keyObj)[0].split("|");
        setting.find("#lower").val(values[0]);
        setting.find("#upper").val(values[1]);
        moveRange();
    }
}

/* get the saved user settings, and update each element that is related to settings */
function getSaved() {
    let allInputs = $("div.setting");
    let setting;
    let callback;
    allInputs.each(function() {
        setting = $(this);
        if (setting.hasClass("radios")) {
            callback = updateRadio;
        }
        else if (setting.hasClass("color")) {
            callback = updateRange;
        }
        else {
            callback = updateSwitch;
        }
        getKeyValue(setting.attr("id"), callback, setting);
    });
}

function moveRange() {
    // Limit input to [0.0, 4.0]
    if ($(this).val() > 4.0)
        $(this).val(4.0);
    else if ($(this).val() < 0.0)
        $(this).val(0.0);
    // Move slider to the correct values
    $("#range").slider("values", 0, $("#lower").val());
    $("#range").slider("values", 1, $("#upper").val());
    backgroundGradient();
}

function backgroundGradient() {
    let firstThreshold = $("#lower").val() / 4.0 * 100;
    var newStyle = document.createElement("style");
    newStyle.innerHTML = 
    `.ui-slider {
        background-image: linear-gradient(to right, hsl(0,100%,50%), hsl(0,100%,50%) ` + String(firstThreshold) + `%,
        hsl(120,100%,50%) ` + String(firstThreshold) + `%);
    }`
    document.body.appendChild(newStyle);
}

$(function() {
    $("#range").slider({
        range: true,
        min: 0,
        max: 4.0,
        step: 0.01,
        values: [2.0, 4.0],
        slide: function(event, ui) { // On slide, update the input values
          $("#lower").val(ui.values[0]);
          $("#upper").val(ui.values[1]);
        },
        stop: function(event, ui) { // When the slide has stopped, save the new values
            $(".color").each(setSaved);
            backgroundGradient();
        }
    });
    $("input[type=\"number\"]").on("change", moveRange);
    getSaved();
    $("div.setting").on("change", setSaved);
})