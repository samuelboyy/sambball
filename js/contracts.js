$(document).ready(function () {
	men_html = document.getElementById("men_page");
	women_html = document.getElementById("women_page");

	if (men_html) {
		gender = "men"
	} else if (women_html) {
		gender = "women"
	}

	fetch('../data/rosters.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

			table = document.getElementById('contracts_tbody');

			lines.forEach(player => {
				infos = player.split(',');
				info = ""

				if (infos[0] == gender & infos[4] != "" & infos[4] != "fa") {
					filter = `${filter_team(infos[3], infos[4])} ${bg_team(infos[3], infos[4])}`;

					if (infos[7] == "coach") {
						filter = `coach`
					} else if (is_oversea(infos[3]) | infos[1] == "王振原" | identity(infos[9]) == "local") {
						filter = `local`
					} else {
						filter = `import`
					}
					if (infos[5] == '') infos[5] = team_link[infos[4]];

					url = ""
					for (let i = 27; i < 30; i += 2) {
						if (infos[i] != "") {
							url += `
							<a style="color:inherit; text-decoration:underline" href="${infos[i + 1]}" target="_blank">
							<i class="bi bi-link-45deg"></i>${infos[i]}</a>`;
						}
					}

					info += `
						<tr class="filterTr ${filter_team(infos[3], infos[4])} ${filter} ${infos[21]} ${infos[22]} showTr">
							<td class="${bg_team(infos[3], infos[4])} borderR">${team_name("short", infos[3], infos[4], gender)}</td>
							<td class="borderR">${infos[2]}</td>
							<td class="borderR"><a style="text-decoration:underline;color:inherit" href="${infos[5]}" target="_blank">${infos[1]}</a></td>
							<td>${infos[23]}</td>
							<td class="borderR">${infos[24]}</td>
							<td class="borderR">${infos[25]}</td>
							<td class="borderR">${infos[26]}</td>
							<td>${url}</td>
						</tr>`
				}

				table.innerHTML += info;
			});
		});



	var teams = document.getElementById("team-dropdown_" + gender).getElementsByClassName("dropdown-item");
	var contracts = document.getElementById("contract-dropdown").getElementsByClassName("dropdown-item");
	var teambtn = document.getElementById("teambtn");
	var contractbtn = document.getElementById("contractbtn");

	for (let i = 0; i < teams.length; i++) {
		teams[i].addEventListener("click", function () {
			var currentTeam = document.getElementById("team-dropdown_" + gender).getElementsByClassName("active");
			currentTeam[0].className = currentTeam[0].className.replace(" active", "");
			this.className += " active";
			teambtn.innerHTML = this.innerHTML;

			f('filter');
		});
	}

	for (let i = 0; i < contracts.length; i++) {
		contracts[i].addEventListener("click", function () {
			var currentContract = document.getElementById("contract-dropdown").getElementsByClassName("dropdown-item active");
			currentContract[0].className = currentContract[0].className.replace(" active", "");
			this.className += " active";
			contractbtn.innerHTML = this.innerHTML;

			f('filter');
		});
	}
});