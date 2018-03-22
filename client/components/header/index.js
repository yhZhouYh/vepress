// import "bulma/sass/grid/columns.sass"
// import "bulma/sass/components/nav.sass"
import './header.css'

$(window).on('scroll', function () {
    var scrollTop = $(window).scrollTop();
    if (scrollTop > 100) {
        $('.sanhe.nav').css('background', '#0391e4')
    }
    if (scrollTop == 0) {
        $('.sanhe.nav').css('background', '#none')
    }
})


