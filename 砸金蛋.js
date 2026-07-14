//砸金蛋
desc("第1张轮播图片，可跳转").findOne(3000).click()
sleep(3000)
var node = textMatches(/剩余\d+次抽奖机会/).findOne(2000)
var num = parseInt(node.text().match(/\d+/)[0])
if (num) {

    for (var i = 0; i < num; i++) {
        var egg = className("android.widget.TextView").find()
        var eggNode = null
        var eggNum = 0
    
        for (var l = 0; l < egg.length; l++) {
            var e = egg[l]
            if (e.clickable() && e.indexInParent() == 1) {
                eggNum = l
                e.click()
                sleep(2000)
                text("我知道了").findOne(2000).click()
                break
            }
        }
    }
    sleep(1000)
    back()
} else {
    back()
}
