// ─── DEMO VERİLER ───
const TICKETS = [
    {
        id: 'TKT-001',
        title: 'Instagram siparişim başlamadı',
        date: '14 Şub 2026',
        time: '18:32',
        status: 'closed',
        messages: [
            { from: 'user',  text: 'Merhaba, 2 saat önce Instagram takipçi siparişi verdim fakat henüz başlamadı. Sipariş numaram: SMM1234567. Yardımcı olabilir misiniz?', time: '18:32' },
            { from: 'admin', text: 'Merhaba! Siparişiniz sistemimizde görünüyor. Kısa bir teknik gecikme yaşandı, siparişiniz şu an başlatıldı. Özür dileriz!', time: '18:45' },
            { from: 'user',  text: 'Teşekkür ederim, görüyorum başladı. Sağolun!', time: '18:48' },
            { from: 'admin', text: 'Rica ederiz, iyi günler! 🙏', time: '18:50' }
        ]
    },
    {
        id: 'TKT-002',
        title: 'Bakiye yüklenemedi',
        date: '13 Şub 2026',
        time: '14:15',
        status: 'open',
        messages: [
            { from: 'user', text: 'IBAN ile 150₺ havale yaptım, 2 saattir bakiyeme yansımadı. Dekont göndermiştim.', time: '14:15' },
            { from: 'system', text: 'Talebiniz alındı. Mesai saatleri içinde yanıt verilecektir.', time: '14:15' }
        ]
    },
    {
        id: 'TKT-003',
        title: 'Sanal numara sorusu',
        date: '12 Şub 2026',
        time: '20:05',
        status: 'closed',
        messages: [
            { from: 'user',  text: 'WhatsApp için Türkiye numarası almak istiyorum, fiyat ne kadar ve süreç nasıl işliyor?', time: '20:05' },
            { from: 'admin', text: 'Türkiye WhatsApp numarası 460₺\'dir. Sipariş verdikten sonra WhatsApp üzerinden sizinle iletişime geçilecektir. Başka sorunuz var mı?', time: '20:12' },
            { from: 'user',  text: 'Harika, teşekkürler!', time: '20:14' }
        ]
    }
];

let activeTicketId = null;

// ─── SİDEBAR ───
function toggleSidebar() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('active');
}

// ─── EKRAN GEÇİŞLERİ ───
function showMain() {
    document.getElementById('mainView').style.display        = 'block';
    document.getElementById('newTicketView').style.display   = 'none';
    document.getElementById('chatView').style.display        = 'none';
    document.getElementById('mainFooter').style.display      = 'block';
    activeTicketId = null;
    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderTickets();
}

function showNewTicket() {
    document.getElementById('mainView').style.display        = 'none';
    document.getElementById('newTicketView').style.display   = 'block';
    document.getElementById('chatView').style.display        = 'none';
    document.getElementById('mainFooter').style.display      = 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openChat(ticketId) {
    const ticket = TICKETS.find(t => t.id === ticketId);
    if (!ticket) return;

    activeTicketId = ticketId;

    document.getElementById('mainView').style.display        = 'none';
    document.getElementById('newTicketView').style.display   = 'none';
    document.getElementById('chatView').style.display        = 'flex';
    document.getElementById('mainFooter').style.display      = 'none';

    // Header
    document.getElementById('chatTitle').textContent    = ticket.title;
    document.getElementById('chatTicketId').textContent = ticket.id + ' · ' + ticket.date;

    // Status badge
    const badge     = document.getElementById('chatStatusBadge');
    const statusMap = { open: ['Açık', 'chat-badge-open'], closed: ['Kapatıldı', 'chat-badge-closed'], pending: ['Beklemede', 'chat-badge-pending'] };
    badge.textContent = statusMap[ticket.status][0];
    badge.className   = 'chat-status-badge ' + statusMap[ticket.status][1];

    // Mesajları render et
    renderMessages(ticket);

    // Input durumu
    const inputWrap   = document.getElementById('chatInputWrap');
    const closedNotice = document.getElementById('chatClosedNotice');

    if (ticket.status === 'closed') {
        inputWrap.style.display    = 'none';
        closedNotice.style.display = 'flex';
    } else {
        inputWrap.style.display    = 'flex';
        closedNotice.style.display = 'none';
        setTimeout(() => document.getElementById('chatInput').focus(), 200);
    }

    // En alta scroll
    setTimeout(() => {
        const msgs = document.getElementById('chatMessages');
        msgs.scrollTop = msgs.scrollHeight;
    }, 100);
}

// ─── MESAJLARI RENDER ET ───
function renderMessages(ticket) {
    const container = document.getElementById('chatMessages');
    container.innerHTML = ticket.messages.map(m => {
        if (m.from === 'system') {
            return `<div class="msg system">
                <div class="msg-bubble">${m.text}</div>
            </div>`;
        }
        if (m.from === 'admin') {
            return `<div class="msg admin">
                <span class="msg-sender"><i class="fas fa-bolt"></i> ROXY STORE</span>
                <div class="msg-bubble">${m.text}</div>
                <span class="msg-time">${m.time}</span>
            </div>`;
        }
        return `<div class="msg user">
            <div class="msg-bubble">${m.text}</div>
            <span class="msg-time">${m.time}</span>
        </div>`;
    }).join('');
}

// ─── MESAJ GÖNDER ───
function sendMessage() {
    const input  = document.getElementById('chatInput');
    const text   = input.value.trim();
    if (!text || !activeTicketId) return;

    const ticket = TICKETS.find(t => t.id === activeTicketId);
    if (!ticket || ticket.status === 'closed') return;

    const now = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    ticket.messages.push({ from: 'user', text, time: now });

    renderMessages(ticket);
    input.value = '';
    input.style.height = 'auto';

    // En alta scroll
    const msgs = document.getElementById('chatMessages');
    msgs.scrollTop = msgs.scrollHeight;
}

// ─── ENTER İLE GÖNDER ───
document.addEventListener('DOMContentLoaded', function () {
    const input = document.getElementById('chatInput');
    if (input) {
        input.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    }
    renderTickets();
});

// ─── AUTO RESIZE TEXTAREA ───
function autoResize(el) {
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

// ─── FORM KONTROL ───
function checkTicketForm() {
    const title   = document.getElementById('ticketTitle').value.trim();
    const content = document.getElementById('ticketContent').value.trim();
    document.getElementById('titleCount').textContent   = title.length + '/100';
    document.getElementById('contentCount').textContent = content.length + '/1000';
    document.getElementById('btnSubmitTicket').disabled = !(title.length >= 5 && content.length >= 10);
}

// ─── TICKET GÖNDER ───
function submitTicket() {
    const title   = document.getElementById('ticketTitle').value.trim();
    const content = document.getElementById('ticketContent').value.trim();
    if (!title || !content) return;

    const now    = new Date();
    const timeStr = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    const id      = 'TKT-' + String(TICKETS.length + 1).padStart(3, '0');

    const newTicket = {
        id,
        title,
        date: dateStr,
        time: timeStr,
        status: 'pending',
        messages: [
            { from: 'user',   text: content, time: timeStr },
            { from: 'system', text: 'Talebiniz alındı. Mesai saatleri içinde yanıt verilecektir.', time: timeStr }
        ]
    };

    // TODO: Firebase'e kaydet
    TICKETS.unshift(newTicket);

    document.getElementById('ticketTitle').value   = '';
    document.getElementById('ticketContent').value = '';
    document.getElementById('titleCount').textContent   = '0/100';
    document.getElementById('contentCount').textContent = '0/1000';
    document.getElementById('btnSubmitTicket').disabled = true;

    showToast('Talebiniz başarıyla gönderildi!');
    showMain();
}

// ─── TİCKETLARI RENDER ET ───
function renderTickets() {
    const list  = document.getElementById('ticketsList');
    const count = document.getElementById('ticketCount');
    count.textContent = TICKETS.length + ' talep';

    if (!TICKETS.length) {
        list.innerHTML = `<div class="empty-tickets">
            <i class="fas fa-ticket-alt"></i>
            <h4>Henüz talep yok</h4>
            <p>Yeni bir destek talebi oluşturabilirsiniz.</p>
        </div>`;
        return;
    }

    const statusLabel = { open: 'Açık', closed: 'Kapatıldı', pending: 'Beklemede' };
    const badgeClass  = { open: 'badge-open', closed: 'badge-closed', pending: 'badge-pending' };
    const dotClass    = { open: 'dot-open', closed: 'dot-closed', pending: 'dot-pending' };

    list.innerHTML = TICKETS.map(t => `
        <div class="ticket-card" onclick="openChat('${t.id}')">
            <div class="ticket-left">
                <div class="ticket-dot ${dotClass[t.status]}"></div>
                <div class="ticket-info">
                    <div class="ticket-title">${t.title}</div>
                    <div class="ticket-meta">${t.id} · ${t.date} ${t.time}</div>
                </div>
            </div>
            <div class="ticket-right">
                <span class="ticket-badge ${badgeClass[t.status]}">${statusLabel[t.status]}</span>
                <i class="fas fa-chevron-right ticket-arrow"></i>
            </div>
        </div>
    `).join('');
}

// ─── TOAST ───
function showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `position:fixed;bottom:30px;left:50%;transform:translateX(-50%);background:linear-gradient(135deg,#00D9FF,#A855F7);color:#0A0A0F;padding:14px 28px;border-radius:12px;font-family:'Poppins',sans-serif;font-weight:700;font-size:14px;z-index:9999;box-shadow:0 10px 40px rgba(0,217,255,0.4);display:flex;align-items:center;gap:10px;white-space:nowrap;transition:opacity 0.5s;`;
    toast.innerHTML = `<i class="fas fa-check-circle"></i> ${msg}`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
}
