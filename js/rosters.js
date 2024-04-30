$(document).ready(function () {
    men_html = document.getElementById("men_page");
    women_html = document.getElementById("women_page");

    tableCount = document.getElementById('r_count_tbody');
    table = document.getElementById('roster_tbody');
    tableOversea = document.getElementById('roster_oversea_tbody');
    table_movements_th = document.getElementById('roster_movements_thead')
    table_movements = document.getElementById('roster_movements_tbody')

    if (men_html) {
        gender = "men"
        team_dropdown = 'team-dropdown_m';
        t_counts = [6, 5, 4];
        teams = ['oversea'];
        for (let i = 0; i < t_counts[0]; i++) teams.push(plg_team[i + 1]);
        for (let i = 0; i < t_counts[1]; i++) teams.push(t1_team[i + 1]);
        for (let i = 0; i < t_counts[2]; i++) teams.push(sbl_team[i + 1]);

        teams_info = [];
        for (let i = 0; i < teams.length; i++) teams_info.push([teams[i], 0, 0, 0, 0]);

    } else if (women_html) {
        gender = "women"
        team_dropdown = 'team-dropdown_w';
        t_counts = 4;
        teams = ['oversea'];
        for (let i = 0; i < t_counts; i++) teams.push(wsbl_team[i + 1]);

        teams_info = [];
        for (let i = 0; i < teams.length; i++) teams_info.push([teams[i], 0, 0, 0, 0]);
    }

    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            team_coach_info = [];
            for (let i = 0; i < teams.length; i++) team_coach_info.push('');

            lines.forEach(player => {
                infos = player.split(',');
                info = ""
                infoOversea = ""
                infoCoach = ""
                infoCount = ""

                if (window.innerWidth <= 576) {
                    blankSpace = `<br>`
                } else {
                    blankSpace = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
                }

                if (infos[0] == gender & infos[6] == "active" & infos[4] != "fa") {
                    if (infos[7] == "headCoach" | infos[7] == "coach") {

                        team_index = findIndex(teams, infos[4]);
                        team_coach_info[team_index] += `${infos[9]}: ${infos[1]}`;

                    } else {
                        if (is_oversea(infos[3])) {
                            team_index = 0;
                            is_local = 1;
                            is_import = infos[7] != "local";
                        } else {
                            team_index = findIndex(teams, infos[4]);
                            is_local = identity(infos[9]) == "local";
                            is_import = identity(infos[9]) == "import";
                        }

                        if (is_local) {
                            teams_info[team_index][1] += age(infos[13]);
                            teams_info[team_index][2] += parseInt(infos[11]);
                            teams_info[team_index][3] += 1;
                        } else if (is_import) {
                            teams_info[team_index][4] += 1;
                        }

                        if (is_local | is_import | infos[9] == "註銷" | infos[9] == "未註冊") {
                            if (is_oversea(infos[3])) {
                                oversea_team = `<td class="borderR">${team_name("full", infos[3], infos[4])}</td>`;
                            } else {
                                oversea_team = ""
                            }

                            if (infos[9] == "註銷" | infos[9] == "未註冊") {
                                id_color = `<a style="color:white">${infos[9]}</a>`
                            } else {
                                id_color = `${infos[9]}`
                            }

                            tempInfo = `
                                <tr class="filterTr ${filter_team(infos[3], infos[4])} ${bg_team(infos[3], infos[4])} showTr" style="font-size:15px">
                                    ${oversea_team}
                                    <td class="borderR" data-order="${num_order(infos[2])}">${infos[2]}</td>
                                    <td><a style="text-decoration:underline;color:inherit" href="${infos[5]}" target="_blank">${infos[1]}</a></td>             
                                    <td data-order=${order[infos[9]]}>${id_color}</td>
                                    <td>${infos[10]}</td>
                                    <td>${infos[11]}</td>
                                    <td>${infos[12]}</td>
                                    <td>${age(infos[13])}</td>
                                    <td class="borderR">${infos[13]}</td>
                                    <td class="borderR textL" style="font-size:14px">${infos[14]}</td>
                                    <td class="textL" style="font-size:14px">${infos[15]}</td>
                                </tr>
                            `
                            if (is_oversea(infos[3])) {
                                infoOversea += tempInfo;
                            } else {
                                info += tempInfo;
                            }
                        }
                    }
                }

                table.innerHTML += info;
                tableOversea.innerHTML += infoOversea;
            });
            if (men_html) {
                a_plg = [];
                h_plg = [];
                a_t1 = [];
                h_t1 = [];
                a_sbl = [];
                h_sbl = [];
            } else if (women_html) {
                a_wsbl = [];
                h_wsbl = [];
            }

            for (let i = 0; i < teams_info.length; i++) {
                teams_info[i].push((teams_info[i][1] / teams_info[i][3]).toFixed(1));
                teams_info[i].push((teams_info[i][2] / teams_info[i][3]).toFixed(1));

                if (i != 0) {
                    if (men_html) {
                        if (i < 1 + t_counts[0]) {
                            a_plg.push(teams_info[i][5])
                            h_plg.push(teams_info[i][6])
                        } else if (i < 1 + t_counts[0] + t_counts[1]) {
                            a_t1.push(teams_info[i][5])
                            h_t1.push(teams_info[i][6])
                        } else if (i < 1 + t_counts[0] + t_counts[1] + t_counts[2]) {
                            a_sbl.push(teams_info[i][5])
                            h_sbl.push(teams_info[i][6])
                        }
                    } else if (women_html) {
                        if (i < 1 + t_counts) {
                            a_wsbl.push(teams_info[i][5])
                            h_wsbl.push(teams_info[i][6])
                        }
                    }
                }
            }
            if (men_html) {
                a_plg = rankArray(a_plg);
                h_plg = rankArray(h_plg);
                a_t1 = rankArray(a_t1);
                h_t1 = rankArray(h_t1);
                a_sbl = rankArray(a_sbl);
                h_sbl = rankArray(h_sbl);
                rankA = a_plg.concat(a_t1, a_sbl);
                rankH = h_plg.concat(h_t1, h_sbl);
            } else if (women_html) {
                rankA = rankArray(a_wsbl);
                rankH = rankArray(h_wsbl);
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

            document.getElementById(team_dropdown).getElementsByClassName('dropdown-item')[1].click();
        });

    fetch('../data/movements.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            if (men_html) {
                teams.push('herobears');
                teams.push('suns');
            }
            teams_movement_info = [];
            for (let i = 0; i < teams.length; i++) teams_movement_info.splice(i, 0, [teams[i], '', '', '']);

            cur_cat = "";

            lines.forEach(player => {
                infos = player.split(',');
                info = ""

                if (infos[0] == gender) {
                    team_index = findIndex(teams, infos[1]);

                    if (infos[2].includes("extend")) {
                        i = 1
                    } else if (infos[2].includes("lost")) {
                        i = 3
                    } else {
                        i = 2
                    }
                    if (cur_cat != infos[2]) {
                        cur_cat = infos[2];

                        if (infos[2] == "change") {
                            cat_name = "轉隊"
                        } else if (infos[2] == "merge") {
                            cat_name = "Via 合併"
                        } else if (infos[2] == "fa") {
                            cat_name = "Via 自由球員"
                        } else if (infos[2] == "trade") {
                            cat_name = "Via 交易"
                        } else if (infos[2] == "keep") {
                            cat_name = "Via 保留名單"
                        } else if (infos[2] == "loan") {
                            cat_name = "Via 租借"
                        } else if (infos[2] == "draft") {
                            cat_name = "Via 選秀"
                        } else if (infos[2] == "lost loan") {
                            cat_name = "Via 租借"
                        } else if (infos[2] == "lost trade") {
                            cat_name = "Via 交易"
                        } else if (infos[2] == "import extend") {
                            cat_name = "續留洋將"
                        } else if (infos[2] == "import") {
                            cat_name = "加盟洋將"
                        } else if (infos[2] == "import lost") {
                            cat_name = "離隊洋將"
                        }

                        if (infos[2] != "extend" & infos[2] != "lost") {
                            if (teams_movement_info[team_index][i] != "") teams_movement_info[team_index][i] += `<br>`
                            teams_movement_info[team_index][i] += `<a style="text-decoration:underline"><i>${cat_name}</i></a><br>`
                        }
                    }
                    teams_movement_info[team_index][i] += `${infos[3]}<br>`
                }
            });
            updateTables();
            document.getElementById(team_dropdown).getElementsByClassName('dropdown-item')[1].click();
        });
});
function updateTables() {
    if (men_html) {
        tableCount.innerHTML = `
        <tr class="filterTr oversea CBA-bg">
            <td>
                CBA:&nbsp;&nbsp;5&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                日本:&nbsp;&nbsp;1&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                其他:&nbsp;&nbsp;1&nbsp;&nbsp;人
            </td>
        </tr>
        <tr class="filterTr oversea CBA-bg">
            <td>
                本土平均年齡:&nbsp;${teams_info[0][5]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                本土平均身高:&nbsp;${teams_info[0][6]}
            </td>
        </tr>`
    } else if (women_html) {
        tableCount.innerHTML = `
        <tr class="filterTr oversea WCBA-bg">
            <td>
                WCBA:&nbsp;&nbsp;6&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                WKBL:&nbsp;&nbsp;1&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                其他:&nbsp;&nbsp;1&nbsp;&nbsp;人
            </td>
        </tr>
        <tr class="filterTr oversea WCBA-bg">
            <td>
                本土平均年齡:&nbsp;${teams_info[0][5]}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                本土平均身高:&nbsp;${teams_info[0][6]}
            </td>
        </tr>`
    }

    for (let i = 1; i < teams_info.length; i++) {
        if (coach_name[teams[i]] != "" & window.innerWidth <= 600) {
            blank = `<br>`
        } else if (window.innerWidth <= 495) {
            blank = '<br>'
        } else {
            blank = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
        }
        tableCount.innerHTML += `
        <tr class="filterTr ${teams_info[i][0]} ${teams_info[i][0]}-bg showTr">
            <td>
                ${team_coach_info[i]}${coach_name[teams[i]]}${blank}
                本土球員:&nbsp;&nbsp;${teams_info[i][3]}&nbsp;&nbsp;人&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                外籍球員:&nbsp;&nbsp;${teams_info[i][4]}&nbsp;&nbsp;人
            </td>
        </tr>`
        avg_filter = `${teams_info[i][0]} ${teams_info[i][0]}-bg`
        if (women_html) {
            league = `WSBL`
        } else if (i < 1 + t_counts[0]) {
            league = 'PLG'
        } else if (i < 1 + t_counts[0] + t_counts[1]) {
            league = 'T1'
        } else {
            league = 'SBL'
        }
        age_league_rank = `(${league}第${rankA[i - 1]})`
        height_league_rank = `(${league}第${rankH[i - 1]})`

        if (window.innerWidth > 510 | i == 0) {
            blank = `&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;`
        } else {
            blank = `<br>`
        }
        tableCount.innerHTML += `
        <tr class="filterTr ${avg_filter} showTr">
            <td>
                本土平均年齡:&nbsp;${teams_info[i][5]}&nbsp;${age_league_rank}${blank}
                本土平均身高:&nbsp;${teams_info[i][6]}&nbsp;${height_league_rank}
            </td>
        </tr>`
    }

    table_movements.innerHTML = ""

    if (window.innerWidth <= 576) {
        table_movements_th.innerHTML = `<th>2023-24 球員異動</th>`

        for (let i = 0; i < teams_movement_info.length; i++) {
            if (teams_movement_info[i][1] == "") teams_movement_info[i][1] = "無 / 未知"
            if (teams_movement_info[i][2] == "") teams_movement_info[i][2] = "無"
            if (teams_movement_info[i][3] == "") teams_movement_info[i][3] = "無"

            table_movements.innerHTML += `
            <tr class="filterTr ${teams_movement_info[i][0]} showTr">
                <td class="textL">
                    <a style="text-decoration:underline; font-size:20px;">續約 / 延長</a><br>${teams_movement_info[i][1]}
                </td>
            </tr>
            <tr class="filterTr ${teams_movement_info[i][0]} showTr">
                <td class="textL">
                    <a style="text-decoration:underline; font-size:20px;">加盟</a><br>${teams_movement_info[i][2]}
                </td>
            </tr>
            <tr class="filterTr ${teams_movement_info[i][0]} showTr">
                <td class="textL">
                    <a style="text-decoration:underline; font-size:20px;">離隊</a><br>${teams_movement_info[i][3]}
                </td>
            </tr>`
        }
    } else {
        table_movements_th.innerHTML = `<th>續約 / 延長</th><th>加盟</th><th>離隊</th>`

        for (let i = 0; i < teams_movement_info.length; i++) {
            if (teams_movement_info[i][1] == "") teams_movement_info[i][1] = "無 / 未知"
            if (teams_movement_info[i][2] == "") teams_movement_info[i][2] = "無"
            if (teams_movement_info[i][3] == "") teams_movement_info[i][3] = "無"

            table_movements.innerHTML += `
            <tr class="filterTr ${teams_movement_info[i][0]} showTr">
                <td class="borderR textL">${teams_movement_info[i][1]}</td>
                <td class="borderR textL">${teams_movement_info[i][2]}</td>
                <td class="textL">${teams_movement_info[i][3]}</td>
            </tr>`
        }
    }
    document.getElementById(team_dropdown).getElementsByClassName('active')[0].click();
}
