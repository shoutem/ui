var mobileNav = document.querySelector(".navigation");
var mobileNavOverlay = document.querySelector(".mobile-menu-overlay");
var pwb = document.querySelector(".phone-wrap.big");
var video = document.querySelector(".video-screen");
var mobileNavClone = mobileNav.cloneNode(true);

mobileNavClone.id = "navigation-clone";

mobileNavOverlay.appendChild(mobileNavClone);

document.querySelector(".close-menu-overlay").onclick = closeMobileNav;

function closeMobileNav () {
	mobileNavClone.className = mobileNav.className.replace(/\sopen\s/ig, "");
	mobileNavOverlay.className = mobileNavOverlay.className.replace(/\sopen\s/ig, "");
}

document.querySelector(".menu-toggle").onclick = function openMobileNav(e)
{
	if( ! mobileNav.className.match(/open/) ) {
		mobileNavClone.className += " open ";
	}

	if( ! mobileNavOverlay.className.match(/open/) ) {
		mobileNavOverlay.className += " open ";
	}

	e.preventDefault();
};



pwb.onclick = function() {
	pwb.className += " playing ";
	video.play();
}

video.onclick = function(e) {
	e.stopPropagation();
	video.pause();
	pwb.className = pwb.className.replace("playing", "");
}

function onFooterResize() {

	if( window.outerWidth <= 640 ) {
		return;
	}

	var site = document.querySelector(".site");
	var footer = document.querySelector(".site-footer");

	setTimeout(function() {
		site.style.marginBottom = footer.scrollHeight + "px";
	}, 300);
}
	
window.onresize = onFooterResize;

onFooterResize();

// http://stackoverflow.com/a/35627449
function scrollTo(element, from, to, duration, currentTime)
{
	if (from <= 0) { from = 0; }
	if (to <= 0) { to = 0; }
	if (currentTime>=duration) return;
	var delta = to-from;
	var progress = currentTime / duration * Math.PI / 2;
	var position = delta * (Math.sin(progress));

	setTimeout(function () {
		element.scrollTop = from + position;
		scrollTo(element, from, to, duration, currentTime + 10);
	}, 10);
}

var $doc = document.querySelector("html");
var $body = document.querySelector("body");
var $footer = document.querySelector(".site-footer");
var $signupButtons = document.querySelectorAll('a[href="#signup"]');

Array.prototype.slice.call($signupButtons).forEach(function(el){
	el.onclick = function(e) {
		var fsh = $footer.scrollHeight;
		scrollTo($doc, $doc.scrollTop, $doc.scrollHeight - fsh, 600, 0);
		scrollTo($body, $body.scrollTop, $body.scrollHeight - fsh, 600, 0);
		closeMobileNav();
		e.preventDefault();
	};
})

var headroom  = new Headroom(document.querySelector(".headroom"), {
		tolerance: {
			down : 10, up : 20
		},
		offset : 81
	}	
);

headroom.init();