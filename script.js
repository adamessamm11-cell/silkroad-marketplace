import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://reccgljqmknihbhffucs.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlY2NnbGpxbWtuaWhiaGZmdWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Nzc3NTEsImV4cCI6MjA5NzQ1Mzc1MX0.iE6Ew_6KGSC7d6sEEj2Lb04uFatSIPfzXegY8nseajs'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
let allAccounts = []; 

window.switchTab = function(tabName) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabName + 'Tab').classList.add('active');
    document.querySelector(`button[onclick*='${tabName}']`).classList.add('active');
    if(tabName === 'buyer') fetchAccounts();
}

window.filterAccounts = function() {
    const s = document.getElementById('searchBar').value.toLowerCase();
    const f = allAccounts.filter(a => a.title.toLowerCase().includes(s));
    renderAccounts(f);
}

async function fetchAccounts() {
    const { data, error } = await supabase.from('accounts').select('*').order('id', { ascending: false });
    if (!error) {
        allAccounts = data;
        renderAccounts(allAccounts);
    }
}

function renderAccounts(list) {
    const grid = document.getElementById('accountsGrid');
    grid.innerHTML = list.map(a => `
        <div class="account-card">
            <h3>${a.title}</h3>
            <p>Price: $${a.price}</p>
        </div>`).join('');
}

document.getElementById('sellAccountForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('accounts').insert([{
        title: document.getElementById('accTitle').value,
        price: parseFloat(document.getElementById('accPrice').value),
        server_name: document.getElementById('accServer').value
    }]);
    if(!error) alert('Success!');
});

fetchAccounts();
