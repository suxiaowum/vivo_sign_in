//砸金蛋
desc("第1张轮播图片，可跳转").findOne(3000).click()
sleep(3000)
var node = textMatches(/剩余\d+次抽奖机会/).findOne(2000)
var num = parseInt(node.text().match(/\d+/)[0])
if (num) {
    var egg = className("android.widget.TextView").find()
    var eggNode = null
    var eggNum = 0
    for (var i = 0; i < egg.length; i++) {
        var e = egg[i]
        if (e.clickable() && e.indexInParent() == 1) {
            eggNum = i
            eggNode = e
            break
        }
    }
    for (let i = 0; i < 5; i++) {
        eggNode.click()
        sleep(1000)
        text("我知道了").findOne().click()
    }
    sleep(1000)
    back()
}else{
    back()
}
