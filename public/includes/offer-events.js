window.addEventListener('pagesLoaded', function(event) {

	var yearSelect = document.querySelector('#year-select');
	var specSelect = document.querySelector('#spec-select');
	var countryCard = document.querySelector('#countryCard');
	var	countryList = document.querySelector('.countries > ul');
	var uniCard = document.querySelector('#uniCard')
	var	universitiesList = document.querySelector('.universities > ul');
	var selectionNav = document.querySelector('.selection-nav');
	var uniPage = document.querySelector('.uni-page');
	var uniPageWrapper = document.querySelector('.uni-page-wrapper');
	var uniPageShade = document.querySelector('.uni-page-shade');
	var uniEscape = document.querySelector('.uni-escape-wrapper');

	var uniLoaded = new Event('uniLoaded');

	const state = {
		selectedYear: null,
		selectedSpec: null
	};

	const actions = {
		offersOpened: function() {

		},
		yearSelected: function(e) {
			state.selectedYear = e.target.value;
			countryList.innerHTML = "";
			universitiesList.innerHTML = "";
			selectionNav.classList.add("hidden");
			selectionNav.classList.remove("fb");
			helpers.fillSpecSelect(state.selectedYear);
			specSelect.classList.remove('hidden');
		},
		specSelected: function(e) {
			state.selectedSpec = e.target.value;
			countryList.innerHTML = "";
			universitiesList.innerHTML = "";
			selectionNav.classList.add("hidden");
			selectionNav.classList.remove("fb");
			helpers.fillCountryDiv();
		},
		countrySelected: function(e) {
			e.stopPropagation();
			state.selectedCountry = e.currentTarget.querySelector('.offer-country-name').textContent;
			universitiesList.innerHTML = "";
			helpers.fillUniversitiesDiv();
			countryList.classList.add("hidden");
			selectionNav.classList.remove("hidden");
			selectionNav.classList.add("fb");
			selectionNav.querySelector('.selected-country-title').innerHTML = state.selectedCountry;
		},
		returnToCountries: function() {
			countryList.classList.remove("hidden");
			universitiesList.classList.add("hidden");
			selectionNav.classList.add("hidden");		
			selectionNav.classList.remove("fb");		
		},
		uniSelected: function(e) {
			e.stopPropagation();
			state.selectedUni = e.currentTarget.querySelector('.offer-uni-name').textContent;
			helpers.getUniPage(state);
			uniPage.classList.add('moved-content');
			uniPageWrapper.classList.add('moved-content');
			uniPageShade.classList.remove('hidden');
			uniEscape.classList.add('appear');

		},
		closeUniPage: function(e) {
			e.stopPropagation();
			uniPage.classList.remove('moved-content');
			uniPageWrapper.classList.remove('moved-content');
			uniPageShade.classList.add('hidden');
			uniEscape.classList.remove('appear');

		}
	}

	window.addEventListener('offersOpened', actions.offersOpened);
	yearSelect.addEventListener('change', actions.yearSelected);
	specSelect.addEventListener('change', actions.specSelected);
	selectionNav.children[0].addEventListener('click', actions.returnToCountries);
	uniEscape.addEventListener('click', actions.closeUniPage);
	uniPageShade.addEventListener('click', actions.closeUniPage);

	const helpers = {
		fillSpecSelect: function(selectedYear) {
			var specs = data.general[selectedYear];
			var filler = "<option value=\"\">-- Votre spécialisation --</option>";
			for (var i = 0; i < specs.length; i++) {
				filler += "<option value=\"" + specs[i] + "\">" + specs[i] + "</option>"
			}
			specSelect.innerHTML = filler;
		},
		fillCountryDiv: function() {
			var countriesAndUnis = helpers.findCountriesAndUnis(state);

			for (var i = 0; i < countriesAndUnis.length; i++) {

				var clone = document.importNode(countryCard.content, true);
				var countryThang = clone.querySelector('.offer-country-card');
				countryThang.children[0].children[0].textContent = countriesAndUnis[i][0]
				countryThang.children[0].children[1].textContent = countriesAndUnis[i][1].length + " université(s) compatible(s)";
				countryThang.children[2].textContent = data.countries[countriesAndUnis[i][0]].desc;
				countryList.appendChild(clone);

			}

			countryList.classList.remove('hidden');

			var availableCountries = document.querySelectorAll('.countries > ul > li');
			for (var i = availableCountries.length - 1; i >= 0; i--) {
				availableCountries[i].addEventListener('click', actions.countrySelected);
			}
		},
		fillUniversitiesDiv: function() {

			var unis = helpers.findCountriesAndUnis(state).filter(country => country[0] === state.selectedCountry)[0][1];

			for (var i = 0; i < unis.length; i++) {

				var clone = document.importNode(uniCard.content, true);
				var uniThang = clone.querySelector('.offer-uni-card');
				uniThang.children[0].textContent = unis[i]

				var tidbits = [];
				tidbits.push("Partenaire depuis " + data.countries[state.selectedCountry][unis[i]].info[2][0]);
				tidbits.push("Taux de satisfaction " + data.countries[state.selectedCountry][unis[i]].info[2][1] + "%");
				tidbits.push("Situé à " + data.countries[state.selectedCountry][unis[i]].info[2][2]);

				for (var j = 0; j < tidbits.length; j++) {
					uniThang.children[1].children[0].innerHTML += "<li class=\"tidbit\">" + tidbits[j] + "</li>";
				}

				universitiesList.appendChild(clone);

			}

			universitiesList.classList.remove('hidden');

			var availableUniversities = document.querySelectorAll('.universities > ul > li');
			for (var i = availableUniversities.length - 1; i >= 0; i--) {
				availableUniversities[i].addEventListener('click', actions.uniSelected);
			}
		},
		fillCoursesDiv: function() {
			var courses = helpers.filterCourses(state);
			var filler = "";
			for (var i = 0; i < courses.length; i++) {
				filler += "<li style=\"color: black;\">" + courses[i][1] + "</li>"
			}
			coursesList.innerHTML = filler;
		},
		filterCourses: function(state) {
			return uniCoursesData[state.selectedUni].filter(attribute => attribute[2].includes(state.selectedSpec))
		},
		findCountriesAndUnis: function(state) {
			var countries = [];
			for (var country in data.countries) {
				var unis = [];
				for (var uni in data.countries[country]) {

					if (uni !== "desc") {
						if (data.countries[country][uni].info[0].includes(parseInt(state.selectedYear, 10)) && data.countries[country][uni].info[1].includes(state.selectedSpec)) {
							unis.push(uni);
						}
					}

				}

				if (unis.length > 0) {
					countries.push([country, unis]);
				}

			}
			return countries;
		},
		getUniPage: function(state) {
			var url = 'data/' + data.countries[state.selectedCountry][state.selectedUni].info[3] + '.html';

			fetch(url)
			.then(function(response) { return response.text(); })
			.then(function(data) {
				uniPage.innerHTML = data;
				window.dispatchEvent(uniLoaded);
			})
			.catch(function(error) { console.log(error) });
		},
	};

});