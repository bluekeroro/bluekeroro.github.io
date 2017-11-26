document.getElementById("start").style.display='inline';
function start(){
    document.getElementById("playerName").innerHTML=document.getElementById("inputPlayerName").value;
    document.getElementById("start").style.display='none';
    source.stop(0);
   // document.getElementById("myCanvas").requestFullScreen();
// 判断各种浏览器，找到正确的方法
    function launchFullScreen(element) {
        if(element.requestFullscreen) {
            element.requestFullscreen();
        } else if(element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if(element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if(element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }
// 启动全屏!
    launchFullScreen(document.documentElement); // 整个网页
    setTimeout(initial,50);
    loop();
}