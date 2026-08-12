

backHome()


/**
 * 返回主页
 */
function backHome() {
    var isHome = desc("我的").exists()
    if (!isHome) {
        back()
        sleep(200)
        backHome()
        
    }
}