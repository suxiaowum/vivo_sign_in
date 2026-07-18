
/**
 * 清空购物车
 * */

id("top_title_shop_cart").findOne().click()
sleep(1000)
if (text("暂无商品").exists()) {
    back()
} else {
    text("编辑").findOne().click()
    text("全选").findOne().click()
    text("删除").findOne().click()
    sleep(1000)
    text("删除").findOnce(1).click()
    sleep(1000)
    back()
}


/**
 * 加入购物车
 * */

desc('选购').click()
let randomNum = Math.floor(Math.random() * 4);
sleep(1000)
var rect = id("shop_phone_icon").findOnce(randomNum).bounds()
console.log(rect)
click(rect.centerX(), rect.centerY())
sleep(2000)
text("加入购物车").findOne(2000).click()
text("确定").findOne(2000).click()
back()
back()



// bounds(316, 1096, 1203, 1414).click()
// text("加入购物车").findOne(2000).click()
// text("确定").findOne(2000).click()
// // sleep(1000)
// // back()
// sleep(500)
// back()







