document.addEventListener('DOMContentLoaded', function(event) {

	var homeWrapper = document.querySelector('.home-wrapper');
	var loadedContent = document.querySelector('.loaded-content');
	var loadedContentDivs = document.querySelectorAll('.loaded-content div');
	var homeTitles = document.querySelector('.home-titles');
	var homeContent = document.querySelector('.home-content');
	var homeNav = document.querySelector('.home-nav');
	var menuItems = document.querySelectorAll('.home-nav ul li');
	var menuItemDivs = document.querySelectorAll('.home-nav ul li div');
	var menuItemLabels = document.querySelectorAll('.home-nav ul li p');
	var escape = document.querySelector('.escape-wrapper');


	var offersOpened = new Event('offersOpened');
	var pagesLoaded = new Event('pagesLoaded');

	const pages = [
		'main/offers.html',
		'main/procedure.html',
		'main/why.html',
		'main/contact.html'
	];

	const state = {
		pageOpen: false,
		openedMenuItem: null
	};

	const actions = {
		highlight: function(e) {
			affectedMenuItem = helpers.getMenuItemIndex(e.target);
			menuItems[affectedMenuItem].classList.add('highlight');
			menuItemLabels[affectedMenuItem].classList.add('italic');
		},
		highlightOff: function(e) {
			affectedMenuItem = helpers.getMenuItemIndex(e.target);

			if (state.pageOpen) {
				if (state.openedMenuItem !== affectedMenuItem) {
					menuItems[affectedMenuItem].classList.remove('highlight');
					menuItemLabels[affectedMenuItem].classList.remove('italic');
				}
			} else {
				menuItems[affectedMenuItem].classList.remove('highlight');
				menuItemLabels[affectedMenuItem].classList.remove('italic');
			}
		},
		menuItemClicked: function(e) {
			e.stopPropagation();
			homeWrapper.classList.add('moved-wrapper');
			loadedContent.classList.add('moved-content');
			affectedMenuItem = helpers.getMenuItemIndex(e.currentTarget); // .currentTarget makes sure it's the element with the listener attached, not child

			// Unhighlight and hide the previously opened menu
			if (state.pageOpen && affectedMenuItem !== state.openedMenuItem) {
				menuItems[state.openedMenuItem].classList.remove('highlight');
				menuItemLabels[state.openedMenuItem].classList.remove('italic');

				loadedContentDivs[state.openedMenuItem].classList.add('hidden');
			}

			homeTitles.classList.add('fade');
			homeContent.classList.add('moved-over');
			homeNav.classList.add('moved-nav');

			for (var i = 0; i < menuItemLabels.length; i++) {
				menuItemLabels[i].classList.add('menu-item-clicked');
			}

			loadedContentDivs[affectedMenuItem].classList.remove('hidden');

			escape.classList.add('appear');

			state.pageOpen = true;
			state.openedMenuItem = affectedMenuItem;

			if (state.openedMenuItem === 0) {
				window.dispatchEvent(offersOpened);
			}
		},
		documentClicked: function(e) {
			if (state.pageOpen) {
				homeWrapper.classList.remove('moved-wrapper');
				loadedContent.classList.remove('moved-content');
				homeTitles.classList.remove('fade');
				homeContent.classList.remove('moved-over');
				homeNav.classList.remove('moved-nav');

				for (var i = 0; i < menuItemLabels.length; i++) {
					menuItemLabels[i].classList.remove('menu-item-clicked');
				}
				
				loadedContentDivs[state.openedMenuItem].classList.add('hidden');

				escape.classList.remove('appear');

				menuItems[state.openedMenuItem].classList.remove('highlight');
				menuItemLabels[state.openedMenuItem].classList.remove('italic');

				state.pageOpen = false;
				state.openedMenuItem = null;
			}
		},
		preloadPages: function(e) {
			for (var i = 0; i < pages.length; i++) {
				helpers.loadContent(i);
			}
		},
		closePage: function(e) {
			e.stopPropagation();
			escape.classList.remove('appear');
			actions.documentClicked();
		},
	};

	for (var i = menuItems.length - 1; i >= 0; i--) {
		menuItems[i].addEventListener('mouseenter', actions.highlight);
		menuItems[i].addEventListener('mouseleave', actions.highlightOff);
		menuItems[i].addEventListener('click', actions.menuItemClicked);
	}
	homeWrapper.addEventListener('click', actions.documentClicked);
	window.addEventListener('load', actions.preloadPages);
	escape.addEventListener('click', actions.closePage);


	const helpers = {
		getMenuItemIndex: function(target) {
			for (var i = target.parentNode.children.length - 1; i >= 0; i--) {
				if (target.parentNode.children[i] == target) {return i};
			}
		},
		loadContent: function(affectedMenuItem) {
			var url = pages[affectedMenuItem];

			fetch(url)
			.then(function(response) { return response.text(); })
			.then(function(data) {
				loadedContentDivs[affectedMenuItem].innerHTML = data;
				if (affectedMenuItem === 3) {
					window.dispatchEvent(pagesLoaded);
					state.pagesLoaded = true;
				}
			})
			.catch(function(error) { console.log(error) });
		},
	};

});