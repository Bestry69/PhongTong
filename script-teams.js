document.addEventListener('DOMContentLoaded', () => {
    const data = getData();
    const teamsWithStats = recalculateAllStats(data);
    renderTeamStats(teamsWithStats, data.matches);
});

function renderTeamStats(teams, matches) {
    const container = document.getElementById('team-stats-container');
    container.innerHTML = '';
    
    teams.sort((a,b) => b.points - a.points); // เรียงตามคะแนน

    teams.forEach(team => {
        const teamMatches = matches.filter(m => m.homeTeam === team.name || m.awayTeam === team.name);
        
        // --- คำนวณลูกเล่น "ฟอร์ม 5 นัดล่าสุด" ---
        const last5Matches = teamMatches.slice(-5).reverse();
        let formHtml = '';
        if (last5Matches.length > 0) {
            last5Matches.forEach(m => {
                let result = 'D';
                if ((m.homeTeam === team.name && m.homeScore > m.awayScore) || (m.awayTeam === team.name && m.awayScore > m.homeScore)) {
                    result = 'W';
                } else if ((m.homeTeam === team.name && m.homeScore < m.awayScore) || (m.awayTeam === team.name && m.awayScore < m.homeScore)) {
                    result = 'L';
                }
                formHtml += `<span class="form-${result}" title="${m.homeTeam} ${m.homeScore}-${m.awayScore} ${m.awayTeam}"></span>`;
            });
        } else {
            formHtml = '<span>ยังไม่มีการแข่งขัน</span>';
        }


        const card = document.createElement('div');
        card.className = 'team-stat-card';
        card.innerHTML = `
            <h3>${team.name}</h3>
            <div class="stat-grid">
                <div class="stat-item">
                    <span class="label">สถิติ (ช-ส-พ)</span>
                    <span class="value">${team.win}-${team.draw}-${team.loss}</span>
                </div>
                <div class="stat-item">
                    <span class="label">ประตู (ได้-เสีย)</span>
                    <span class="value">${team.goalsFor}-${team.goalsAgainst}</span>
                </div>
            </div>
            <h4>ฟอร์ม 5 นัดล่าสุด</h4>
            <div class="form-viz">${formHtml}</div>
        `;
        container.appendChild(card);
    });
}