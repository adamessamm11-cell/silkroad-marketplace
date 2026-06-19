import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient('https://reccgljqmknihbhffucs.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlY2NnbGpxbWtuaWhiaGZmdWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Nzc3NTEsImV4cCI6MjA5NzQ1Mzc1MX0.iE6Ew_6KGSC7d6sEEj2Lb04uFatSIPfzXegY8nseajs')

window.switchTab = (tab) => {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.getElementById(tab + 'Tab').classList.add('active');
}

async function fetchAccounts() {
    const { data } = await supabase.from('accounts').select('*');
    render(data || []);
}

function render(list) {
    const grid = document.getElementById('accountsGrid');
    grid.innerHTML = list.map(a => `
        <div class="account-card">
            <h3>${a.title}</h3>
            <p>Price: $${a.price}</p>
        </div>`).join('');
}

document.getElementById('sellAccountForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    await supabase.from('accounts').insert([{
        title: document.getElementById('accTitle').value,
        price: parseFloat(document.getElementById('accPrice').value)
    }]);
    alert('Done!');
    window.switchTab('buyer');
    fetchAccounts();
});

fetchAccounts();
