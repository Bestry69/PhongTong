document.addEventListener('DOMContentLoaded', () => {
    const data = getData();
    const teamsWithStats = recalculateAllStats(data);
    
    populateDropdowns();
    renderTable(teamsWithStats);

    const matchForm = document.getElementById('add-match-form');
    matchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const homeTeamName = document.getElementById('home-team').value;
        const awayTeamName = document.getElementById('away-team').value;
        const homeScore = parseInt(document.getElementById('home-score').value);
        const awayScore = parseInt(document.getElementById('away-score').value);

        if (homeTeamName === awayTeamName) {
            alert('ทีมต้องไม่ซ้ำกัน!');
            return;
        }

        // เพิ่มแมตช์ใหม่เข้าไปในประวัติ
        data.matches.push({
            id: Date.now(), // ID สำหรับการลบในอนาคต
            homeTeam: homeTeamName,
            homeScore: homeScore,
            awayTeam: awayTeamName,
            awayScore: awayScore,
        });

        saveData(data);
        alert('บันทึกผลการแข่งขันเรียบร้อย!');
        
        // คำนวณและแสดงตารางใหม่
        const updatedTeams = recalculateAllStats(data);
        renderTable(updatedTeams);
        matchForm.reset();
    });
});

function populateDropdowns() {
    const homeSelect = document.getElementById('home-team');
    const awaySelect = document.getElementById('away-team');
    CONFIG.friends.forEach(friend => {
        homeSelect.innerHTML += `<option value="${friend}">${friend}</option>`;
        awaySelect.innerHTML += `<option value="${friend}">${friend}</option>`;
    });
}

function renderTable(teams) {
    teams.sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
        return b.goalsFor - a.goalsFor;
    });

    const tableBody = document.getElementById('league-table-body');
    tableBody.innerHTML = '';
    teams.forEach((team, index) => {
        const row = `
            <tr>
                <td>${index + 1}</td>
                <td>${team.name}</td>
                <td>${team.played}</td>
                <td>${team.win}</td>
                <td>${team.draw}</td>
                <td>${team.loss}</td>
                <td>${team.goalsFor}</td>
                <td>${team.goalsAgainst}</td>
                <td>${team.goalDifference}</td>
                <td><strong>${team.points}</strong></td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}