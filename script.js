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
    const server = document.getElementById('filterServer').value.toLowerCase();
    const price = parseFloat(document.getElementById('filterPrice').value);

    const f = allAccounts.filter(a => {
        return (a.title.toLowerCase().includes(s) || (a.description && a.description.toLowerCase().includes(s))) &&
               (a.server_name && a.server_name.toLowerCase().includes(server)) &&
               (isNaN(price) || a.price <= price);
    });
    renderAccounts(f);
}

async function fetchAccounts() {
    const { data, error } = await supabase.from('accounts').select('*').order('id', { ascending: false });
    if (!error) {
        allAccounts = data || [];
        renderAccounts(allAccounts);
    } else {
        console.error('Fetch error:', error.message);
    }
}

function renderAccounts(list) {
    const grid = document.getElementById('accountsGrid');
    if (list.length === 0) {
        grid.innerHTML = '<p style="text-align:center; color:#666;">No accounts found.</p>';
        return;
    }
    grid.innerHTML = list.map(a => `
        <div class="account-card">
            <h3>${a.title}</h3>
            <p>Server: ${a.server_name}</p>
            <p>Level: ${a.level}</p>
            <p>Price: $${a.price}</p>
            <p style="color:#aaa;">${a.description || ''}</p>
            <a href="https://wa.me/${a.seller_phone}" target="_blank" class="submit-btn">Contact WhatsApp</a>
        </div>
    `).join('');
}

document.getElementById('sellAccountForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('accounts').insert([{
        title: document.getElementById('accTitle').value,
        level: parseInt(document.getElementById('accLevel').value),
        server_name: document.getElementById('accServer').value,
        price: parseFloat(document.getElementById('accPrice').value),
        description: document.getElementById('accDesc').value,
        seller_name: document.getElementById('sellerName').value,
        seller_phone: document.getElementById('sellerPhone').value,
        is_sold: false
    }]);

    if(!error) {
        alert('Published successfully!');
        document.getElementById('sellAccountForm').reset();
        window.switchTab('buyer');
    } else {
        alert('Error: ' + error.message);
    }
});

fetchAccounts();
