import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
    'https://reccgljqmknihbhffucs.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlY2NnbGpxbWtuaWhiaGZmdWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Nzc3NTEsImV4cCI6MjA5NzQ1Mzc1MX0.iE6Ew_6KGSC7d6sEEj2Lb04uFatSIPfzXegY8nseajs'
);

async function fetchAccounts() {
    const grid = document.getElementById('accountsGrid');
    // تأكد من اسم الجدول هنا، لو غيرته لـ accounts اكتب accounts
    const { data, error } = await supabase.from('ORigin accountss').select('*');
    
    if (error) {
        grid.innerHTML = `<p>حدث خطأ: ${error.message}</p>`;
        return;
    }
    
    grid.innerHTML = data.map(acc => `
        <div class="card">
            <h3>${acc.title}</h3>
            <p><strong>السيرفر:</strong> ${acc.server_name || 'غير محدد'}</p>
            <p><strong>الليدل (Level):</strong> ${acc.level || '0'}</p>
            <p><strong>السعر:</strong> ${acc.price || '0'}$</p>
            <p><strong>البائع:</strong> ${acc.seller_name || 'غير معروف'}</p>
        </div>
    `).join('');
}

fetchAccounts();
