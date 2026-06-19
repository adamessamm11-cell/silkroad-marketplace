import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
    'https://reccgljqmknihbhffucs.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlY2NnbGpxbWtuaWhiaGZmdWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Nzc3NTEsImV4cCI6MjA5NzQ1Mzc1MX0.iE6Ew_6KGSC7d6sEEj2Lb04uFatSIPfzXegY8nseajs'
);

async function fetchAccounts() {
    const grid = document.getElementById('accountsGrid');
    
    // استخدمنا الاسم اللي ظاهر عندك في الـ Table Editor
    const { data, error } = await supabase.from('"ORigin accountss"').select('*');
    
    if (error) {
        grid.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        return;
    }
    
    if (!data || data.length === 0) {
        grid.innerHTML = `<p style="text-align:center;">الجدول فاضي في Supabase يا دوما!</p>`;
        return;
    }
    
    grid.innerHTML = data.map(acc => `
        <div class="card">
            <h3>${acc.title || 'بدون عنوان'}</h3>
            <p>السعر: $${acc.price || '0'}</p>
        </div>
    `).join('');
}

fetchAccounts();
