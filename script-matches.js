document.addEventListener('DOMContentLoaded', () => {
    renderMatchList();
    
    const resetButton = document.getElementById('reset-data-button');
    resetButton.addEventListener('click', () => {
        const password = prompt("โปรดใส่รหัสผ่านเพื่อรีเซ็ตข้อมูลทั้งหมด:");
        if (password === null) return;
        
        if (password === CONFIG.resetPassword) {
            if (confirm("แน่ใจหรือไม่ที่จะลบข้อมูลทั้งหมด?")) {
                localStorage.removeItem(CONFIG.localStorageKey);
                alert("ข้อมูลถูกลบแล้ว");
                location.reload();
            }
        } else {
            alert("รหัสผ่านไม่ถูกต้อง!");
        }
    });
});

function renderMatchList() {
    const data = getData();
    const matchList = document.getElementById('match-list');
    matchList.innerHTML = '';
    
    if (data.matches.length === 0) {
        matchList.innerHTML = '<p style="text-align:center;">ยังไม่มีการแข่งขัน</p>';
        return;
    }

    // เรียงแมตช์ใหม่ล่าสุดขึ้นก่อน
    const sortedMatches = data.matches.slice().reverse();

    sortedMatches.forEach(match => {
        const matchEl = document.createElement('div');
        matchEl.className = 'match-card';
        matchEl.innerHTML = `
            <div class="match-info">
                <span>${match.homeTeam}</span>
                <strong>${match.homeScore} - ${match.awayScore}</strong>
                <span>${match.awayTeam}</span>
            </div>
            <button class="delete-match-btn" data-match-id="${match.id}" title="ลบผลการแข่งนี้">🗑️</button>
        `;
        matchList.appendChild(matchEl);
    });
    
    addDeleteListeners();
}

function addDeleteListeners() {
    document.querySelectorAll('.delete-match-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const matchIdToDelete = parseInt(e.currentTarget.getAttribute('data-match-id'));
            if (confirm("ต้องการลบผลการแข่งนี้ใช่หรือไม่?")) {
                let data = getData();
                data.matches = data.matches.filter(m => m.id !== matchIdToDelete);
                saveData(data);
                renderMatchList(); // โหลดรายการใหม่
            }
        });
    });
}