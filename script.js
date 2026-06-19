import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = 'https://reccgljqmknihbhffucs.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJlY2NnbGpxbWtuaWhiaGZmdWNzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4Nzc3NTEsImV4cCI6MjA5NzQ1Mzc1MX0.iE6Ew_6KGSC7d6sEEj2Lb04uFatSIPfzXegY8nseajs'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

let allAccounts = []; 

window.switchTab = function(tabName) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-btn');

    tabs.forEach(tab => {
        tab.style.opacity = '0';
        tab.style.transform = 'translateY(10px)';
        setTimeout(() => tab.classList.remove('active'), 200);
    });
    buttons.forEach(btn => btn.classList.remove('active'));

    setTimeout(() => {
        if (tabName === 'buyer') {
            const buyerTab = document.getElementById('buyerTab');
            buyerTab.classList.add('active');
            setTimeout(() => {
                buyerTab.style.opacity = '1';
                buyerTab.style.transform = 'translateY(0)';
            }, 50);
            
            document.querySelector("button[onclick*='buyer']").classList.add('active');
            fetchAccounts();
        } else if (tabName === 'seller') {
            const sellerTab = document.getElementById('sellerTab');
            sellerTab.classList.add('active');
            setTimeout(() => {
                sellerTab.style.opacity = '1';
                sellerTab.style.transform = 'translateY(0)';
            }, 50);
            document.querySelector("button[onclick*='seller']").classList.add('active');
        }
    }, 200);
}

async function fetchAccounts() {
    const { data: accounts, error } = await supabase
        .from('ORigin accountss')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error('Error fetching accounts:', error.message);
        return;
    }

    allAccounts = accounts; 
    renderAccounts(allAccounts); 
}

function renderAccounts(accountsList) {
    const grid = document.getElementById('accountsGrid');
    grid.innerHTML = ''; 

    if(accountsList.length === 0) {
        grid.innerHTML = `<p style="text-align:center; color:#666; grid-column: 1/-1; margin-top:20px;">No legendary accounts match your search criteria ⚔️</p>`;
        return;
    }

    accountsList.forEach(acc => {
        const imgUrl = acc.image_url ? acc.image_url : 'https://placehold.co/600x400/1a1a1a/fff?text=No+Character+Image';
        
        const card = document.createElement('div');
        card.className = 'account-card';
        card.innerHTML = `
            <img src="${imgUrl}" class="card-img" alt="Account Image">
            <div class="card-body">
                <h3 class="card-title">${acc.title}</h3>
                <div class="card-meta"><b>Server:</b> ${acc.server_name}</div>
                <div class="card-meta"><b>Level:</b> ${acc.level}</div>
                <div class="card-meta" style="color:#aaa;">${acc.description || 'No description provided.'}</div>
                <div class="card-price">$${acc.price}</div>
                <a href="https://wa.me/${acc.seller_phone}?text=Hello, I am interested in your account: ${acc.title}" target="_blank" class="buy-btn">
                   💬 Contact via WhatsApp
                </a>
            </div>
        `;
        grid.appendChild(card);
    });
}

window.filterAccounts = function() {
    const searchTxt = document.getElementById('searchBar').value.toLowerCase();
    const serverTxt = document.getElementById('filterServer').value.toLowerCase();
    const maxPrice = parseFloat(document.getElementById('filterPrice').value);

    const filtered = allAccounts.filter(acc => {
        const matchesSearch = acc.title.toLowerCase().includes(searchTxt) || (acc.description && acc.description.toLowerCase().includes(searchTxt));
        const matchesServer = acc.server_name.toLowerCase().includes(serverTxt);
        const matchesPrice = isNaN(maxPrice) || acc.price <= maxPrice;

        return matchesSearch && matchesServer && matchesPrice;
    });

    renderAccounts(filtered);
}

fetchAccounts();

document.getElementById('sellAccountForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const imageFile = document.getElementById('accImage').files[0];
    let imageUrl = null;

    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('account_images')
        .upload(filePath, imageFile);

      if (!uploadError) {
        const { data: linkData } = supabase
          .storage
          .from('account_images')
          .getPublicUrl(filePath);
        imageUrl = linkData.publicUrl;
      } else {
        console.error("Storage upload error:", uploadError.message);
      }
    }

    const { data, error } = await supabase
      .from('ORigin accountss')
      .insert([
        {
          title: document.getElementById('accTitle').value,
          level: parseInt(document.getElementById('accLevel').value),
          server_name: document.getElementById('accServer').value,
          price: parseFloat(document.getElementById('accPrice').value),
          description: document.getElementById('accDesc').value,
          seller_name: document.getElementById('sellerName').value,
          seller_phone: document.getElementById('sellerPhone').value,
          image_url: imageUrl,
          is_sold: false
        }
      ]);

    if (error) {
      alert('Error: ' + error.message);
    } else {
      alert('Success! Your Legend has been published!');
      document.getElementById('sellAccountForm').reset();
      switchTab('buyer');
    }
});
