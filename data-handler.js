// --- การตั้งค่าเริ่มต้น ---
const CONFIG = {
    friends: ['เบส', 'เพชร', 'ทิว', 'ปลาม', 'โอแคท'], // << แก้ไขชื่อเพื่อนของคุณที่นี่
    localStorageKey: 'friendsLeagueData_v2',
    resetPassword: '1234' // << ตั้งรหัสผ่านสำหรับรีเซ็ตที่นี่
};

// --- ฟังก์ชันหลักในการจัดการข้อมูล ---

// โหลดข้อมูลจาก Local Storage หรือสร้างใหม่
function getData() {
    const dataFromStorage = localStorage.getItem(CONFIG.localStorageKey);
    if (dataFromStorage) {
        return JSON.parse(dataFromStorage);
    }
    // สร้างข้อมูลเริ่มต้นถ้ายังไม่มี
    return {
        teams: CONFIG.friends.map(name => ({ name })),
        matches: []
    };
}

// บันทึกข้อมูลลง Local Storage
function saveData(data) {
    localStorage.setItem(CONFIG.localStorageKey, JSON.stringify(data));
}

// **(ลูกเล่นใหม่)** คำนวณสถิติทั้งหมดจากประวัติการแข่ง
function recalculateAllStats(data) {
    // 1. รีเซ็ตสถิติทั้งหมดของทุกทีม
    const teams = CONFIG.friends.map(name => ({
        name: name,
        played: 0, win: 0, draw: 0, loss: 0,
        goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0
    }));

    // 2. วนลูปทุกแมตช์ที่เคยแข่งเพื่อคำนวณใหม่
    for (const match of data.matches) {
        const homeTeam = teams.find(t => t.name === match.homeTeam);
        const awayTeam = teams.find(t => t.name === match.awayTeam);

        if (!homeTeam || !awayTeam) continue;

        homeTeam.played++;
        awayTeam.played++;
        homeTeam.goalsFor += match.homeScore;
        awayTeam.goalsFor += match.awayScore;
        homeTeam.goalsAgainst += match.awayScore;
        awayTeam.goalsAgainst += match.homeScore;

        if (match.homeScore > match.awayScore) {
            homeTeam.win++;
            homeTeam.points += 3;
            awayTeam.loss++;
        } else if (match.awayScore > match.homeScore) {
            awayTeam.win++;
            awayTeam.points += 3;
            homeTeam.loss++;
        } else {
            homeTeam.draw++;
            awayTeam.draw++;
            homeTeam.points++;
            awayTeam.points++;
        }
    }
    
    // 3. คำนวณผลต่างประตู
    teams.forEach(team => {
        team.goalDifference = team.goalsFor - team.goalsAgainst;
    });

    return teams;
}