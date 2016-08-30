var mobileNav = document.querySelector(".navigation");
var mobileNavOverlay = document.querySelector(".mobile-menu-overlay");
var videoContainer = document.querySelector(".video-screen");
var video = videoContainer.querySelector("video");
var mobileNavClone = mobileNav.cloneNode(true);

var $doc = document.querySelector("html");
var $body = document.querySelector("body");
var $footer = document.querySelector(".site-footer");
var $signupButtons = document.querySelectorAll('a[href="#signup"]');

/* Navigation */
mobileNavClone.id = "navigation-clone";
mobileNavOverlay.appendChild(mobileNavClone);

document.querySelector(".close-menu-overlay").onclick = closeMobileNav;

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

/* Videos */
videoContainer.onmouseleave = function(e)
{
	videoContainer.className = videoContainer.className.replace("hide-controls", "").trim();
};

videoContainer.onclick = video.onclick = function(e)
{
	e.stopPropagation();

	var c = videoContainer.className;
	var v = videoContainer.querySelector("video");

	if( c.indexOf("playing") > -1 ) {
		c = c.replace("playing", "");
		v.pause();
	} else {
		c += " playing hide-controls";
		v.play();
	}

	videoContainer.className = c.trim();
};

/* Footer */
window.onresize = onFooterResize;

onFooterResize();

Array.prototype.slice.call($signupButtons).forEach(function(el)
{
	el.onclick = function(e)
	{
		var fsh = $footer.scrollHeight;
		scrollTo($doc, $doc.scrollTop, $doc.scrollHeight - fsh, 600, 0);
		scrollTo($body, $body.scrollTop, $body.scrollHeight - fsh, 600, 0);
		closeMobileNav();
		e.preventDefault();
	};
})

/* Header */
var headroom  = new Headroom(document.querySelector(".headroom"), {
		tolerance: {
			down : 10, up : 20
		},
		offset : 81
	}	
);

headroom.init();



function closeMobileNav ()
{
	mobileNavClone.className = mobileNav.className.replace(/\sopen\s/ig, "");
	mobileNavOverlay.className = mobileNavOverlay.className.replace(/\sopen\s/ig, "");
}

function onFooterResize()
{
	if( window.outerWidth <= 640 ) {
		return;
	}

	var site = document.querySelector(".site");
	var footer = document.querySelector(".site-footer");

	setTimeout(function() {
		site.style.marginBottom = footer.scrollHeight + "px";
	}, 300);
}

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
