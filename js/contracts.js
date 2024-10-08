class Player {
	static player_id = 0;

	constructor(gender, name, league, team, jersey_num, player_url, league_identity,
		contract_season, contract_years, contract_years_left, contract_note, contract_link = '', filter = '') {

		this.player_id = Player.player_id++;
		this.gender = gender;
		this.name = name;
		this.league = league;
		this.team = team;
		this.jersey_num = jersey_num;
		this.player_url = player_url;
		this.league_identity = league_identity;
		this.contract_season = contract_season;
		this.contract_years = contract_years;
		this.contract_years_left = contract_years_left;
		this.contract_note = contract_note;
		this.contract_link = contract_link;
		this.filter = filter;
	}
}
allPlayers = [];
// console.log(allPlayers);
$(document).ready(function () {
	table = document.getElementById('contracts_tbody');

	fetch('../data/rosters.csv')
		.then((response) => response.text())
		.then((result) => {

			lines = result.split('\n');
			lines = lines.slice(2);

			table = document.getElementById('contracts_tbody');

			lines.forEach(line => {
				infos = line.split(',');

				let [
					gender,
					name,
					jersey_num, league, team, player_url,
					status,
					identity,
					rookie,
					league_identity, pos, height, weight, birth,
					school,
					acquired,
					last_team,
					contract_filter, contract_season, contract_years, contract_years_left,
					contract_note,
					contract_link_title, contract_url,
					fa_status,  last_season_league, last_season_team, fa_gp, fa_ppg, fa_rpg, fa_apg

				] = infos;

				if (gender == 'men' & (status == 'active' | status == 'away') & team != 'fa') {
					player1 = new Player();
					allPlayers.push(player1);

					player1.gender = gender;
					player1.name = name;
					player1.league = league;
					player1.team = team;
					player1.jersey_num = jersey_num;
					player1.player_url = playerUrl(team, player_url);
					player1.contract_season = contract_season;
					player1.contract_years = contract_years;
					player1.contract_years_left = contract_years_left;
					player1.contract_note = contract_note;

					player1.filter += contract_filter;

					if (isOversea(team)) {
						player1.league_identity = 'local';
					} else if (leagueIdFilter(league_identity) == 'import') {
						player1.league_identity = 'import';
					} else if (leagueIdFilter(league_identity) == 'local') {
						player1.league_identity = 'local';
					}

					if (contract_years_left.includes('0')) {
						player1.filter += ' 1y';
					}

					if (contract_filter.includes('trade')) {
						if (contract_season != '') player1.contract_season = `*${contract_season}*`;
						if (contract_years != '') player1.contract_years = `*${contract_years}*`;
						if (contract_years_left != '') player1.contract_years_left = `*${contract_years_left}*`;
					}

					if (contract_url != '') {
						player1.contract_link =
							`<a style="color:inherit; text-decoration:underline" href="${contract_url}" target="_blank">
							<i class="bi bi-link-45deg"></i>${contract_link_title}</a>`;
					}
				}
			});
			allPlayers.forEach(p => {
				if (isOversea(p.team)) {
					team_name = `<a style="font-size:12px">${teamName('short', p.league, p.team, 'img')}`
				} else {
					team_name = `${teamName('short', p.league, p.team, 'img')}`
				}

				table.innerHTML += `
				<tr class="filterTr ${p.gender} ${teamFilter(p.team)} ${p.league_identity} ${p.filter} ">
					<td class="${teamBG(p.league, p.team)} borderR">${team_name}</td>
					<td class="borderR">${p.jersey_num}</td>
					<td class="borderR"><a style="text-decoration:underline;color:inherit" href="${p.player_url}" target="_blank">${p.name}</a></td>
					<td>${p.contract_season}</td>
					<td class="borderR">${p.contract_years}</td>
					<td class="borderR">${p.contract_years_left}</td>
					<td class="borderR">${p.contract_note}</td>
					<td>${p.contract_link}</td>
				</tr>`
			});

			document.getElementById('gender-dropdown').getElementsByClassName('dropdown-item')[0].click();
		});

	add_team_dropdown("team-dropdown", "men", 'all oversea');

	var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
	var genderbtn = document.getElementById("genderbtn");
	var teams = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item");
	var contracts = document.getElementById("contract-dropdown").getElementsByClassName("dropdown-item");
	var teambtn = document.getElementById("teambtn");
	var contractbtn = document.getElementById("contractbtn");

	for (var i = 0; i < genders.length; i++) {
		genders[i].addEventListener("click", function () {
			var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
			currentGender[0].className = currentGender[0].className.replace(" active", "");
			this.className += " active";
			genderbtn.innerHTML = this.innerHTML;

			f('filter');
		});
	}

	for (let i = 0; i < teams.length; i++) {
		teams[i].addEventListener("click", function () {
			var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
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