import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabase = createClient(
    'https://reccgljqmknihbhffucs.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlY2NnbGpxbWtuaWhiaGZmdWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Nzc3NTEsImV4cCI6MjA5NzQ1Mzc1MX0.iE6Ew_6KGSC7d6sEEj2Lb04uFatSIPfzXegY8nseajs'
);

async function fetchAccounts() {
    const grid = document.getElementById('accountsGrid');
    
    // هنا التعديل المهم: استخدمنا اسم الجدول الجديد "accounts"
    const { data, error } = await supabase.from('accounts').select('*');
    
    if (error) {
        console.error("خطأ Supabase:", error);
        grid.innerHTML = `<p style="color:red;">Error: ${error.message}</p>`;
        return;
    }
    
    if (!data || data.length === 0) {
        grid.innerHTML = `<p style="text-align:center;">الجدول فاضي، ضيف بيانات في جدول 'accounts' داخل Supabase!</p>`;
        return;
    }
    
    grid.innerHTML = data.map(acc => `
        <div class="card">
            <h3>${acc.title || 'بدون اسم'}</h3>
            <p>السعر: $${acc.price || '0'}</p>
        </div>
    `).join('');
}

fetchAccounts();