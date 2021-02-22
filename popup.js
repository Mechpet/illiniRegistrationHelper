"use strict";

/* set to storage the new user setting value */
function setSaved() {
    let keyName, keyObj;
    let currSetting = $(this);
    keyName = currSetting.attr("id");
    keyObj = {};
    if (currSetting.hasClass("radios")) {
        keyObj[keyName] = currSetting.find("input:checked").val();
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

/* get the saved user settings, and update each element that is related to settings */
function getSaved() {
    let allInputs = $("div.setting");
    let setting;
    allInputs.each(function() {
        setting = $(this);
        getKeyValue(setting.attr("id"), (setting.hasClass("radios")) ? updateRadio : updateSwitch, setting);
    });
}

$(function() {
    getSaved();
    $("div.setting").on("change", setSaved);
})