class Player {
    static player_id = 0;

    constructor(gender, name, league, team, team_order, jersey_num, player_url,
        league_identity, pos, height, weight, birth, age, school, acquired, filter = '') {

        this.player_id = Player.player_id++;
        this.gender = gender;
        this.name = name;
        this.league = league;
        this.team = team;
        this.team_order = team_order;
        this.jersey_num = jersey_num;
        this.player_url = player_url;
        this.league_identity = league_identity;
        this.pos = pos;
        this.height = height;
        this.weight = weight;
        this.birth = birth;
        this.age = age;
        this.school = school;
        this.acquired = acquired;
        this.filter = filter;
    }
}
class Roster {
    constructor(gender, league, id, coach = '',
        local_age_sum = 0, local_height_sum = 0, local_count = 0, import_count = 0, age_rank, height_rank,
        extension = [], signed = [], lost = []) {
        this.gender = gender;
        this.league = league;
        this.id = id;
        this.coach = coach;
        this.local_age_sum = local_age_sum;
        this.local_height_sum = local_height_sum;
        this.local_count = local_count;
        this.import_count = import_count;
        this.age_rank = age_rank;
        this.height_rank = height_rank;
        this.extension = extension;
        this.signed = signed;
        this.lost = lost;
    }

    avg(value) {
        if (value == "age") {
            return (this.local_age_sum / this.local_count);
        } else if (value = "height") {
            return (this.local_height_sum / this.local_count);
        }
    }
}
class Movement {
    constructor(move, content = '') {
        this.move = move;
        this.content = content;
    }
}
allPlayers = [];
// console.log(allPlayers);
allRosters = [new Roster('men', 'oversea', 'oversea'), new Roster('women', 'oversea', 'oversea')];
allTeams.forEach(team => {
    allRosters.push(new Roster(team.gender, team.league, team.id, team.coach))
});

men_oversea = [['CBA', 0], ['日本', 0]];
women_oversea = [['WCBA', 0], ['韓國', 0]];
$(document).ready(function () {

    tableCount = document.getElementById('r_count_tbody');
    table = document.getElementById('roster_tbody');
    tableOversea = document.getElementById('roster_oversea_tbody');
    table_movements_th = document.getElementById('roster_movements_thead')
    table_movements = document.getElementById('roster_movements_tbody')

    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            oversea_team_order = 0;
            current_team = '';

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

                if (status == "active" & team != "fa") {

                    player1 = new Player();
                    allPlayers.push(player1);

                    player1.gender = gender;
                    player1.name = name;
                    player1.league = league;
                    player1.team = team;
                    player1.jersey_num = jersey_num;
                    player1.player_url = playerUrl(team, player_url);
                    player1.league_identity = league_identity;
                    player1.pos = pos;
                    player1.height = height;
                    player1.weight = weight;
                    player1.birth = birth;
                    player1.age = birthToAge(birth);
                    player1.school = school;
                    player1.acquired = acquired;

                    if (isOversea(team)) {
                        if (gender == 'men') {
                            oversea_count = men_oversea;
                        } else if (gender == 'women') {
                            oversea_count = women_oversea;
                        }

                        if (league.includes('CBA') | league.includes('日本') | league.includes('韓國')) {
                            oversea_count.forEach(oversea => {
                                if (league.includes(oversea[0])) {
                                    oversea[1] += 1;
                                }
                            })
                        } else {
                            oversea_count[oversea_count.length - 1][1] += 1;
                        }


                        if (current_team != team) {
                            oversea_team_order += 1;
                            current_team = team;
                        }
                        player1.team_order = oversea_team_order;

                        if (gender == "men") {
                            team_index = 0;
                        } else if (gender == "women") {
                            team_index = 1;
                        }
                        is_local = 1;
                        is_import = 0;

                    } else {
                        team_index = 2 + findTeam(team).teamIndex();
                        is_local = leagueIdFilter(league_identity) == "local";
                        is_import = leagueIdFilter(league_identity) == "import";
                    }

                    if (is_local | is_import) {
                        if (is_local) {
                            allRosters[team_index].local_age_sum += birthToAge(birth);
                            allRosters[team_index].local_height_sum += parseInt(height);
                            allRosters[team_index].local_count += 1;

                        } else if (is_import) {
                            allRosters[team_index].import_count += 1;
                        }
                    }
                }
            });
            allPlayers.forEach(p => {
                if (isOversea(p.team)) {
                    table = document.getElementById('roster_oversea_tbody');
                    oversea_team =
                        `<td class="${teamBG(p.league, p.team)} borderR" style='font-size:12px' data-order="${p.team_order}">
                        ${teamName('short', p.league, p.team)}
                    </td>`
                } else {
                    table = document.getElementById('roster_tbody');
                    oversea_team = '';
                }

                table.innerHTML +=
                    `<tr class="filterTr ${p.gender} ${teamFilter(p.team)} ${teamBG(p.league, p.team)} ${p.filter}">
                    ${oversea_team}
                    <td class="borderR" data-order="${numOrder(p.jersey_num)}">${p.jersey_num}</td>
                    <td class="borderR"><a style="text-decoration:underline;color:inherit" href="${p.player_url}" target="_blank">${p.name}</a></td>             
                    <td data-order=${order[p.league_identity]}>${p.league_identity}</td>
                    <td>${p.pos}</td>
                    <td>${p.height}</td>
                    <td>${p.weight}</td>
                    <td>${p.age}</td>
                    <td class="borderR">${p.birth}</td>
                    <td class="borderR textL" style="font-size:14px">${p.school}</td>
                    <td class="textL" style="font-size:14px">${p.acquired}</td>
                </tr>`
            })


            for (let i = 2; i < allRosters.length; i++) {
                rank_age = 1;
                rank_height = 1;
                for (let j = 2; j < allRosters.length; j++) {
                    if (allRosters[i].league == allRosters[j].league) {
                        if (allRosters[i].avg('age') < allRosters[j].avg('age')) {
                            rank_age += 1;
                        }
                        if (allRosters[i].avg('height') < allRosters[j].avg('height')) {
                            rank_height += 1;
                        }
                    }
                }
                allRosters[i].age_rank = rank_age;
                allRosters[i].height_rank = rank_height;
            }

            var dataTable = $('#rosters_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [0, 'asc'],
            });

            var dataTable2 = $('#rosters_oversea_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [],
            });

            updateTables();
            document.getElementById("gender-dropdown").getElementsByClassName('dropdown-item')[0].click();
        });

    fetch('../data/movements.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            lines.forEach(player => {
                infos = player.split(',');

                let [
                    gender,
                    team,
                    move_id,
                    move,
                    player_name,
                    content,
                    none

                ] = infos;

                if (move_id != "") {
                    if (team == 'oversea') {
                        if (gender == 'men') team_index = 0
                        if (gender == 'women') team_index = 1
                    } else {
                        team_index = 2 + findTeam(team).teamIndex();
                    }

                    if (move_id == 'extension') {
                        current_move = allRosters[team_index].extension;
                    } else if (move_id == 'signed') {
                        current_move = allRosters[team_index].signed;
                    } else if (move_id == 'lost') {
                        current_move = allRosters[team_index].lost;
                    }

                    new_move = 1;
                    for (let i = 0; i < current_move.length; i++) {
                        if (current_move[i].move == move) {
                            if (content != '') {
                                current_move[i].content += `${player_name} (${content})<br>`;
                            } else {
                                current_move[i].content += `${player_name}<br>`;
                            }
                            new_move = 0;
                        }
                    }
                    if (new_move == 1) {
                        movement1 = new Movement(move);
                        current_move.push(movement1);
                        if (move != '續約' & move != '離隊') {
                            movement1.content = `<a style="text-decoration:underline"><i>${move}</i></a><br>`
                        }

                        if (content != '') {
                            movement1.content += `${player_name} (${content})<br>`;
                        } else {
                            movement1.content += `${player_name}<br>`;
                        }
                    }
                }
            });
            updateMovements();
            document.getElementById("gender-dropdown").getElementsByClassName('dropdown-item')[0].click();
        });

    window.addEventListener('resize', updateTables);
    window.addEventListener('resize', updateMovements);

    var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
    var genderbtn = document.getElementById("genderbtn");
    var roster_tbs = document.getElementsByClassName("filterTb");
    var move_check = document.getElementById("move_check").querySelector("input[type='checkbox']");

    for (var i = 0; i < genders.length; i++) {
        genders[i].addEventListener("click", function () {
            switch_gender = 0;
            if (this.className != "dropdown-item active") {
                switch_gender = 1;
            }
            var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
            currentGender[0].className = currentGender[0].className.replace(" active", "");
            this.className += " active";
            genderbtn.innerHTML = this.innerHTML;

            if (switch_gender == 1) {
                if (this.innerHTML == "男籃") {
                    add_team_dropdown('team-dropdown', 'men', 'oversea');

                } else if (this.innerHTML == "女籃") {
                    add_team_dropdown('team-dropdown', 'women', 'oversea');

                }
                var teams = document.getElementById("team-dropdown").getElementsByClassName("dropdown-item");
                var teambtn = document.getElementById("teambtn");
                for (var i = 0; i < teams.length; i++) {
                    teams[i].addEventListener("click", function () {
                        if (this.innerHTML.includes("旅外")) {
                            roster_tbs[1].className = roster_tbs[1].className.replace(" showTb", "");
                            roster_tbs[2].className += " showTb";
                        } else if (roster_tbs[2].className.includes("showTb")) {
                            roster_tbs[2].className = roster_tbs[2].className.replace(" showTb", "");
                            roster_tbs[1].className += " showTb";
                        }
                        var currentTeam = document.getElementById("team-dropdown").getElementsByClassName("active");
                        if (currentTeam.length != 0) currentTeam[0].className = currentTeam[0].className.replace(" active", "");
                        this.className += " active";
                        teambtn.innerHTML = this.innerHTML;

                        f('filter');
                    });
                }
                teams[0].click();
            }
        });
    }

    move_check.addEventListener("click", function () {
        if (move_check.checked) {
            roster_tbs[0].className += " showTb";
        } else {
            roster_tbs[0].className = roster_tbs[0].className.replace(" showTb", "");
        }
    });
});
function updateTables() {
    count_men = '';
    count_women = '';
    blank = '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';

    for (let i = 0; i < men_oversea.length; i++) {
        if (i != 0) count_men += `${blank}`;
        count_men += `${men_oversea[i][0]}:&nbsp;&nbsp;${men_oversea[i][1]}&nbsp;&nbsp;人`
    }
    for (let i = 0; i < women_oversea.length; i++) {
        if (i != 0) count_women += `${blank}`;
        count_women += `${women_oversea[i][0]}:&nbsp;&nbsp;${women_oversea[i][1]}&nbsp;&nbsp;人`
    }
    tableCount.innerHTML = `
        <tr class="filterTr men oversea CBA-bg">
            <td>${count_men}</td>
        </tr>
        <tr class="filterTr men oversea CBA-bg">
            <td>
                本土平均年齡:&nbsp;${allRosters[0].avg('age').toFixed(1)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                本土平均身高:&nbsp;${allRosters[0].avg('height').toFixed(1)}
            </td>
        </tr>
        <tr class="filterTr women oversea WCBA-bg">
            <td>${count_women}</td>
        </tr>
        <tr class="filterTr women oversea WCBA-bg">
            <td>
            本土平均年齡:&nbsp;${allRosters[1].avg('age').toFixed(1)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            本土平均身高:&nbsp;${allRosters[1].avg('height').toFixed(1)}
            </td>
        </tr>`


    for (let i = 2; i < allRosters.length; i++) {
        if (window.innerWidth <= 600) {
            blank = `<br>`
        } else {
            blank = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
        }
        tableCount.innerHTML += `
        <tr class="filterTr ${allRosters[i].gender} ${allRosters[i].id} ${allRosters[i].id}-bg">
            <td>
                ${allRosters[i].coach}${blank}
                本土球員:&nbsp;&nbsp;${allRosters[i].local_count}&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                外籍球員:&nbsp;&nbsp;${allRosters[i].import_count}&nbsp;&nbsp;人
            </td>
        </tr>`
        if (window.innerWidth > 510) {
            blank = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
        } else {
            blank = `<br>`
        }
        tableCount.innerHTML += `
        <tr class="filterTr ${allRosters[i].gender} ${allRosters[i].id} ${allRosters[i].id}-bg">
            <td>
                本土平均年齡:&nbsp;${allRosters[i].avg('age').toFixed(1)}&nbsp;(${allRosters[i].league.toUpperCase()}第${allRosters[i].age_rank})${blank}
                本土平均身高:&nbsp;${allRosters[i].avg('height').toFixed(1)}&nbsp;(${allRosters[i].league.toUpperCase()}第${allRosters[i].height_rank})
            </td>
        </tr>`
    }
    document.getElementById("team-dropdown").getElementsByClassName('active')[0].click();
}
function updateMovements() {
    table_movements.innerHTML = ""


    if (window.innerWidth <= 576) {
        table_movements_th.innerHTML = `<th style="font-size:18px">2024-25 球員異動</th>`

        for (let i = 0; i < allRosters.length; i++) {
            extension = '';
            signed = '';
            lost = '';
            if (allRosters[i].extension.length > 0) {
                for (let j = 0; j < allRosters[i].extension.length; j++) {
                    if (j != 0) extension += '<br>';
                    extension += allRosters[i].extension[j].content;
                }
            } else {
                extension = '無 / 未知'
            }
            if (allRosters[i].signed.length > 0) {
                for (let j = 0; j < allRosters[i].signed.length; j++) {
                    if (j != 0) signed += '<br>';
                    signed += allRosters[i].signed[j].content;
                }
            } else {
                signed = '無 / 未知'
            }
            if (allRosters[i].lost.length > 0) {
                for (let j = 0; j < allRosters[i].lost.length; j++) {
                    if (j != 0) lost += '<br>';
                    lost += allRosters[i].lost[j].content;
                }
            } else {
                lost = '無 / 未知'
            }
            table_movements.innerHTML += `
            <tr class="filterTr ${allRosters[i].gender} ${allRosters[i].id}">
                <td class="textL">
                    <a style="text-decoration:underline; font-size:20px;"><b>Re-Signed</b></a><br>${extension}
                </td>
            </tr>
            <tr class="filterTr ${allRosters[i].gender} ${allRosters[i].id}">
                <td class="textL">
                    <a style="text-decoration:underline; font-size:20px;"><b>Signed</b></a><br>${signed}
                </td>
            </tr>
            <tr class="filterTr ${allRosters[i].gender} ${allRosters[i].id}">
                <td class="textL">
                    <a style="text-decoration:underline; font-size:20px;"><b>Lost</b></a><br>${lost}
                </td>
            </tr>`
        }
    } else {
        table_movements_th.innerHTML = `
        <th style="font-size:18px"><b>Re-Signed</b></th>
        <th style="font-size:18px"><b>Signed</b></th>
        <th style="font-size:18px"><b>Lost</b></th>`

        for (let i = 0; i < allRosters.length; i++) {
            extension = '';
            signed = '';
            lost = '';
            if (allRosters[i].extension.length > 0) {
                for (let j = 0; j < allRosters[i].extension.length; j++) {
                    if (j != 0) extension += '<br>';
                    extension += allRosters[i].extension[j].content;
                }
            } else {
                extension = '<br>無 / 未知<br><br>'
            }
            if (allRosters[i].signed.length > 0) {
                for (let j = 0; j < allRosters[i].signed.length; j++) {
                    if (j != 0) signed += '<br>';
                    signed += allRosters[i].signed[j].content;
                }
            } else {
                signed = '<br>無 / 未知<br><br>'
            }
            if (allRosters[i].lost.length > 0) {
                for (let j = 0; j < allRosters[i].lost.length; j++) {
                    if (j != 0) lost += '<br>';
                    lost += allRosters[i].lost[j].content;
                }
            } else {
                lost = '<br>無 / 未知<br><br>'
            }

            table_movements.innerHTML += `
            <tr class="filterTr ${allRosters[i].gender} ${allRosters[i].id}">
                <td class="borderR textL">${extension}</td>
                <td class="borderR textL">${signed}</td>
                <td class="textL">${lost}</td>
            </tr>`
        }
    }
    document.getElementById("team-dropdown").getElementsByClassName('active')[0].click();
}
