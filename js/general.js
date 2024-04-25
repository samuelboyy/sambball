$(document).ready(function () {

    timeStamp = document.getElementById("timeStamp");
    timeStamp.innerHTML = `<b>更新日期: 2024.04.21</b>`

    if (document.getElementById("men_page")) {
        navbar_dropdown = document.getElementById("men-navbar-dropdown");
        navbar_dropdown.innerHTML = `
        <button class="btn dropdown-toggle nav-link" style="width:auto" data-bs-toggle="dropdown" aria-expanded="false">
            女籃
        </button>
        <ul class="dropdown-menu">
            <li><a class="nav-link" href="../women/standings">&nbsp;戰績</a></li>
            <li><a class="nav-link" href="../women/rosters">&nbsp;球隊陣容</a></li>
            <li><a class="nav-link" href="../women/players">&nbsp;現役球員</a></li>
            <li><a class="nav-link" href="../women/drafts">&nbsp;選秀</a></li>
            <li><a class="nav-link" href="../women/us-students">&nbsp;旅美學生</a></li>
        </ul>`

    } else if (document.getElementById("women_page")) {
        navbar_dropdown = document.getElementById("women-navbar-dropdown");
        navbar_dropdown.innerHTML = `
        <button class="btn dropdown-toggle nav-link" style="width:auto" data-bs-toggle="dropdown" aria-expanded="false">
			男籃
		</button>
		<ul class="dropdown-menu">
			<li><a class="nav-link" href="../men/standings">&nbsp;戰績</a></li>
			<li><a class="nav-link" href="../men/rosters">&nbsp;球隊陣容</a></li>
			<li><a class="nav-link" href="../men/players">&nbsp;現役球員</a></li>
			<li><a class="nav-link" href="../men/contracts">&nbsp;合約</a></li>
			<li><a class="nav-link" href="../men/drafts">&nbsp;選秀</a></li>
			<li><a class="nav-link" href="../men/trades">&nbsp;交易</a></li>
			<li><a class="nav-link" href="../men/free-agents">&nbsp;自由球員</a></li>
			<li><a class="nav-link" href="../men/us-students">&nbsp;旅美學生</a></li>
		</ul>`
    }

    if (document.getElementById('team-dropdown_m')) {
        teams = [];
        t_counts = [6, 5, 4];
        for (let i = 0; i < t_counts[0]; i++) teams.splice(i, 0, plg_teamRank[i + 1]);
        for (let i = 0; i < t_counts[1]; i++) teams.splice(i + t_counts[0], 0, t1_teamRank[i + 1]);
        for (let i = 0; i < t_counts[2]; i++) teams.splice(i + t_counts[0] + t_counts[1], 0, sbl_teamRank[i + 1]);

        for (let i = 0; i < teams.length; i++) {
            menu = document.getElementById("menu_" + teams[i]);
            menu.innerHTML += `<img src="../asset/images/men/${teams[i]}.png" alt="${teams[i]}" class="teamicon">${cn_teamName[teams[i]]}</a></li>`
        }
    } else if (document.getElementById('team-dropdown_w')) {
        teams = [];
        t_counts = 4;
        for (let i = 0; i < t_counts; i++) teams.splice(i, 0, wsbl_teamRank[i + 1]);
        for (let i = 0; i < teams.length; i++) {
            menu = document.getElementById("menu_" + teams[i]);
            menu.innerHTML += `<img src="../asset/images/women/${teams[i]}.png" alt="${teams[i]}" class="teamicon">${cn_teamName[teams[i]]}</a></li>`
        }
    }

    footerBody = document.getElementById("footerContent");
    footerBody.innerHTML = `
    <div class="container" style="padding:1.5rem;text-align:center;">
                    <a style="color:white;">
                        山姆籃球
                    </a>
                    <br>
                    <a style="color:white;"
                        href="https://www.instagram.com/sam_basketball_tw/" target="blank">
                        <i class="bi bi-instagram" style="color:white; font-size: 18px;"></i>
                        sam_basketball_tw&nbsp;
                    </a>
                    <a style="color:white;"
                        href="mailto:sambasketballtw@gmail.com"> 
                        <i class="bi bi-envelope-open" style="color:white; font-size: 18px;"></i>
                        Gmail
                    </a>
                    <br>
                    <a style="color:white; font-size:12px;">All rights reserved © 2024</a>
    </div>`
});
plg_teamRank = {
    5: 'braves',
    3: 'kings',
    1: 'pilots',
    4: 'lioneers',
    2: 'dreamers',
    6: 'steelers'
}
t1_teamRank = {
    1: 'dea',
    4: 'mars',
    2: 'leopards',
    5: 'ghosthawks',
    3: 'aquas'
}
sbl_teamRank = {
    1: 'beer',
    2: 'bank',
    3: 'yulon',
    4: 'bll'
}
wsbl_teamRank = {
    2: 'cathay',
    3: 'taipower',
    4: 'cht',
    1: 'taiyuen'
}
playoff = {
    "braves": "",
    "kings": "",
    "pilots": "",
    "lioneers": "",
    "dreamers": "",
    "steelers": "- o",
    "dea": "- x",
    "mars": "- x",
    "leopards": "- x",
    "ghosthawks": "- o",
    "aquas": "- x",
    "beer": "- f",
    "bank": "- c",
    "yulon": "- c",
    "bll": "- o",

    "cathay": "- c",
    "taipower": "- c",
    "cht": "- o",
    "taiyuen": "- f"
}
coach_name = {
    "braves": "",
    "kings": " Ryan Marchand",
    "pilots": " Iurgi Caminos",
    "lioneers": " Milan Mitrović",
    "dreamers": " Jamie Pearlman",
    "steelers": "",
    "dea": "",
    "mars": "",
    "leopards": " Charles Dubé-Brais",
    "ghosthawks": " Raoul Korner",
    "aquas": " Branden Joyce",
    "beer": "",
    "bank": "",
    "yulon": "",
    "bll": "",

    "cathay": "",
    "taipower": "",
    "cht": "",
    "taiyuen": ""
}

gm_name = {
    "braves": "領隊: 蔡承儒",
    "kings": "GM: 毛加恩",
    "pilots": "GM: 李忠恕",
    "lioneers": "GM: 張樹人",
    "dreamers": "GM: 韓駿鎧",
    "steelers": "GM: 高景炎",
    "dea": "GM: 劉志威",
    "mars": "GM: 林祐廷",
    "leopards": "執行長: 張建偉",
    "ghosthawks": "GM: 錢韋成",
    "aquas": "執行長: 李偉誠",
    "beer": "",
    "bank": "",
    "yulon": "",
    "bll": "",

    "cathay": "",
    "taipower": "",
    "cht": "",
    "taiyuen": ""
}

order = {
    "本土": 1,
    "華裔": 2,
    "外籍生": 3,
    "洋將": 4,
    "亞外": 5,

    "CBA": 1,
    "日本 B2": 2,
    "TAT": 3,
    "braves": 11,
    "kings": 12,
    "pilots": 13,
    "lioneers": 14,
    "dreamers": 15,
    "steelers": 16,
    "dea": 21,
    "mars": 22,
    "leopards": 23,
    "ghosthawks": 24,
    "aquas": 25,
    "herobears": 26,
    "suns": 27,
    "beer": 31,
    "bank": 32,
    "yulon": 33,
    "bll": 34,

    "WCBA": 1,
    "WKBL": 2,
    "葡萄牙PNB": 3,
    "cathay": 4,
    "taipower": 5,
    "cht": 6,
    "taiyuen": 7,

    "fa": 40
}
cn_teamName = {
    "fa": "自由球員",
    "braves": "臺北富邦勇士",
    "kings": "新北國王",
    "pilots": "桃園璞園領航猿",
    "lioneers": "新竹御頂攻城獅",
    "dreamers": "福爾摩沙夢想家",
    "steelers": "高雄17直播鋼鐵人",
    "dea": "新北中信特攻",
    "mars": "臺北戰神",
    "leopards": "台啤永豐雲豹",
    "ghosthawks": "臺南台鋼獵鷹",
    "aquas": "高雄全家海神",
    "beer": "台灣啤酒",
    "bank": "臺灣銀行",
    "yulon": "裕隆納智捷",
    "bll": "彰化柏力力",

    "cathay": "國泰人壽",
    "taiyuen": "台元紡織",
    "taipower": "台灣電力",
    "cht": "中華電信",

    "suns": "臺中太陽",
    "herobears": "台灣啤酒英熊"
}
short_teamName = {
    "braves": "勇士",
    "kings": "國王",
    "pilots": "領航猿",
    "lioneers": "攻城獅",
    "dreamers": "夢想家",
    "steelers": "鋼鐵人",
    "dea": "特攻",
    "mars": "戰神",
    "leopards": "雲豹",
    "ghosthawks": "獵鷹",
    "aquas": "海神",
    "beer": "台啤",
    "bank": "臺銀",
    "yulon": "裕隆",
    "bll": "柏力力",

    "cathay": "國泰",
    "taiyuen": "台元",
    "taipower": "台電",
    "cht": "電信"
}
college = {
    "中州科大": "ccut",
    "中信學院": "ctbcbs",
    "中原大學": "cycu",
    "文化大學": "pccu",
    "世新大學": "shu",
    "北市大學": "utaipei",
    "佛光大學": "fgu",
    "宏國德霖": "hdut",
    "亞洲大學": "asiau",
    "明道大學": "mdu",
    "東南科大": "tungnanu",
    "虎尾科大": "nfu",
    "政治大學": "nccu",
    "首府大學": "shoufuu",
    "高雄師大": "nknu",
    "健行科大": "uch",
    "國立體大": "ntsu",
    "康寧大學": "ukn",
    "陽明交通": "nycu",
    "萬能科大": "vnu",
    "義守大學": "isu",
    "僑光科大": "ocu",
    "實踐大學": "usc",
    "彰化師大": "ncue",
    "臺北科大": "ntut",
    "臺灣科大": "ntust",
    "臺灣師大": "ntnu",
    "臺灣藝大": "ntua",
    "臺灣體大": "ntusport",
    "輔仁大學": "fjcu",
    "醒吾科大": "hwu"
}