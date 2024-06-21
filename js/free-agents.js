$(document).ready(function () {
    fetch('../data/rosters.csv')
        .then((response) => response.text())
        .then((result) => {

            lines = result.split('\n');
            lines = lines.slice(2);

            table = document.getElementById('roster_fa_tbody');

            oversea_order = 0;
            current_team = '';

            lines.forEach(player => {
                infos = player.split(',');
                info = ""

                if (infos[24] != "") {
                    if (isOversea(infos[16])) {
                        if (current_team != infos[16]) {
                            oversea_order += 1;
                            current_team = infos[16];
                        }
                        team_order = oversea_order;
                    } else {
                        team_order = oversea_order + findTeam(infos[16]).teamIndex() + 1;
                    }

                    info += `
                    <tr class="filterTr ${infos[0]}">
                        <td><a style="text-decoration:underline; color:inherit" href="${playerUrl(infos[4], infos[5])}" target="_blank">${infos[1]}</a></td>
                        <td>${infos[10]}</td>
                        <td>${birthToAge(infos[13])}</td>
                        <td class="borderR">${infos[11]}</td>
                        <td>${infos[24]}</td>
                        <td class="${teamBG(infos[3], infos[16])} borderR" data-order="${team_order}">${teamName('full', infos[3], infos[16])}</td>
                        <td data-order="${infos[25]}">${secToTime(infos[25])}</td>
                        <td>${infos[26]}</td>
                        <td>${infos[27]}</td>
                        <td>${infos[28]}</td>              
                    </tr>`
                }

                table.innerHTML += info;
            })

            var dataTable = $('#fa_tb').DataTable({
                dom: 't',
                paging: false,
                scrollCollapse: true,
                info: false,
                ordering: true,
                order: [],
            });
            document.getElementById('gender-dropdown').getElementsByClassName('dropdown-item')[0].click();
        });

    var genders = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item");
    var genderbtn = document.getElementById("genderbtn");

    for (var i = 0; i < genders.length; i++) {
        genders[i].addEventListener("click", function () {
            var currentGender = document.getElementById("gender-dropdown").getElementsByClassName("dropdown-item active");
            currentGender[0].className = currentGender[0].className.replace(" active", "");
            this.className += " active";
            genderbtn.innerHTML = this.innerHTML;

            f('filter');
        });
    }
});