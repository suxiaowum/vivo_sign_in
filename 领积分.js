
//领积分
var btnarr = className("android.widget.Button").find()
for (var i = 0; i < btnarr.length; i++) {
    if (btnarr[i].text() == "" && btnarr[i].indexInParent() == 2) {
        btnarr[i].click()
    }
}
sleep(500)
var arr = text("领取积分").find()
console.log(arr.length)
for (var i = 0; i < arr.length; i++) {
    text("领取积分").findOne().click()
}

