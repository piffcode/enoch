@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Lato:wght@300;400;700&display=swap');

:root{
  --bg: #f9f7f4;
  --card: #ffffff;
  --text: #2d2d2d;
  --muted: #7a7a7a;
  --border: rgba(220,200,190,.3);
  --shadow: 0 4px 20px rgba(0,0,0,.06);
  --radius: 2px;
  --accent: #d4756c;
  --accent-light: #f4e8e6;
}

*{ box-sizing: border-box; }
html,body{ height: 100%; }

body{
  margin: 0;
  font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  color: var(--text);
  background: var(--bg);
  line-height: 1.7;
  font-weight: 300;
}

.wrap{
  max-width: 900px;
  margin: 0 auto;
  padding: 80px 24px 100px;
}

.header{
  text-align: center;
  margin-bottom: 80px;
  padding-bottom: 40px;
  border-bottom: 1px solid var(--border);
}

/* IMPROVEMENT 1: Hero image styling */
.hero-image{
  width: 100%;
  max-width: 600px;
  height: 400px;
  margin: 40px auto 0;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
  background: linear-gradient(135deg, #f4e8e6 0%, #e8d5d0 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Playfair Display', serif;
  font-size: 18px;
  color: var(--muted);
  font-style: italic;
}

.hero-image img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.eyebrow{
  letter-spacing: .2em;
  text-transform: uppercase;
  color: var(--accent);
  font-size: 11px;
  margin: 0 0 16px;
  font-weight: 400;
}

h1{
  margin: 0 0 20px;
  font-size: clamp(42px, 6vw, 72px);
  font-family: 'Playfair Display', Georgia, serif;
  font-weight: 400;
  color: var(--text);
  letter-spacing: -.01em;
  line-height: 1.1;
}

.subhead{
  margin: 0 auto;
  max-width: 560px;
  color: var(--muted);
  line-height: 1.8;
  font-size: 17px;
  font-weight: 300;
}

.card{
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 48px;
  box-shadow: var(--shadow);
  margin: 40px 0;
}

.card h2{
  margin: 0 0 24px;
  font-size: 28px;
  font-family: 'Playfair Display', Georgia, serif;
  letter-spacing: -.01em;
  color: var(--text);
  font-weight: 400;
  text-align: center;
}

.card p{
  margin: 16px 0;
  line-height: 1.8;
  font-weight: 300;
}

.muted{ color: var(--muted); }

.buttons{
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-top: 32px;
  justify-content: center;
}

.btn{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 16px 32px;
  border-radius: var(--radius);
  border: 1px solid var(--text);
  color: var(--text);
  text-decoration: none;
  background: transparent;
  transition: all .3s ease;
  min-width: 200px;
  font-weight: 400;
  letter-spacing: .05em;
  text-transform: uppercase;
  font-size: 12px;
  cursor: pointer;
}

.btn:hover{
  background: var(--text);
  color: white;
}

.btn.primary{
  background: var(--accent);
  border-color: var(--accent);
  color: white;
}

.btn.primary:hover{
  background: #c06459;
  border-color: #c06459;
}

/* Overall tracker */
.tracker{ 
  margin-top: 32px;
  padding: 32px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}

.tracker-top{
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  text-align: center;
}

.tracker-text{ 
  margin: 0; 
  font-weight: 400;
  color: var(--text);
  font-size: 18px;
}

.tracker-goal{ 
  margin: 0; 
  color: var(--muted); 
  font-size: 15px;
  font-weight: 300;
}

.progress{
  margin-top: 24px;
  height: 4px;
  border-radius: 0;
  background: var(--accent-light);
  border: none;
  overflow: hidden;
}

.progress-fill{
  height: 100%;
  width: 0%;
  border-radius: 0;
  background: var(--accent);
  transition: width 1s cubic-bezier(.4, 0, .2, 1);
}

.tracker-note{ 
  margin: 24px 0 0; 
  color: var(--muted);
  font-size: 15px;
  text-align: center;
  font-weight: 300;
  font-style: italic;
}

/* Essentials grid */
.grid{
  margin-top: 32px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 24px;
}

.item{
  display: block;
  padding: 32px 24px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--card);
  text-decoration: none;
  color: var(--text);
  transition: all .3s ease;
  text-align: center;
}

.item:hover{
  border-color: var(--accent);
  box-shadow: 0 8px 24px rgba(0,0,0,.08);
}

.item h3{ 
  margin: 0 0 12px; 
  font-size: 18px;
  font-weight: 400;
  font-family: 'Playfair Display', Georgia, serif;
}

.item p{ 
  margin: 0; 
  color: var(--muted); 
  line-height: 1.6;
  font-weight: 300;
  font-size: 14px;
}

/* Care registry list */
.care-list{
  display: grid;
  gap: 16px;
  margin-top: 32px;
}

.care-choice{
  width: 100%;
  text-align: left;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24px;
  padding: 28px 32px;
  border-radius: var(--radius);
  border: 1px solid var(--border);
  background: var(--card);
  color: var(--text);
  cursor: pointer;
  transition: all .3s ease;
}

.care-choice:hover{
  border-color: var(--accent);
  box-shadow: 0 4px 16px rgba(0,0,0,.06);
}

.care-choice.selected{
  border-color: var(--accent);
  background: var(--accent-light);
}

.care-left h3{ 
  margin: 0 0 8px; 
  font-size: 17px;
  font-weight: 400;
  font-family: 'Playfair Display', Georgia, serif;
  color: var(--text);
}

.care-sub{
  margin: 0;
  color: var(--muted);
  font-size: 14px;
  line-height: 1.6;
  font-weight: 300;
}

.care-right{
  text-align: right;
  min-width: 140px;
}

.care-amount{
  font-size: 15px;
  color: var(--text);
  white-space: nowrap;
  font-weight: 400;
}

.care-mini{
  margin-top: 6px;
  font-size: 12px;
  color: var(--muted);
  font-weight: 300;
  font-style: italic;
}

.care-selected{
  margin-top: 24px;
  padding: 20px 24px;
  border: 1px solid var(--accent);
  border-radius: var(--radius);
  background: var(--accent-light);
  font-size: 15px;
  text-align: center;
}

.footer{
  text-align: center;
  margin-top: 80px;
  padding-top: 40px;
  border-top: 1px solid var(--border);
  color: var(--muted);
  font-weight: 300;
  font-size: 15px;
}

/* IMPROVEMENT 3: Thank you modal */
.modal-overlay{
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  opacity: 0;
  pointer-events: none;
  transition: opacity .3s ease;
  padding: 20px;
}

.modal-overlay.show{
  opacity: 1;
  pointer-events: all;
}

.modal{
  background: white;
  border-radius: var(--radius);
  padding: 48px 40px;
  max-width: 500px;
  width: 100%;
  box-shadow: 0 20px 60px rgba(0,0,0,.2);
  text-align: center;
  transform: translateY(20px);
  transition: transform .3s ease;
}

.modal-overlay.show .modal{
  transform: translateY(0);
}

.modal h3{
  margin: 0 0 16px;
  font-family: 'Playfair Display', serif;
  font-size: 32px;
  font-weight: 400;
  color: var(--text);
}

.modal p{
  margin: 0 0 24px;
  color: var(--muted);
  line-height: 1.7;
  font-weight: 300;
}

.modal .category-highlight{
  color: var(--accent);
  font-weight: 400;
}

.modal-close{
  display: inline-block;
  padding: 14px 32px;
  border-radius: var(--radius);
  border: 1px solid var(--accent);
  background: var(--accent);
  color: white;
  text-decoration: none;
  cursor: pointer;
  font-weight: 400;
  letter-spacing: .05em;
  text-transform: uppercase;
  font-size: 12px;
  transition: all .3s ease;
}

.modal-close:hover{
  background: #c06459;
  border-color: #c06459;
}

/* Mobile responsive */
@media (max-width: 760px){
  .grid{ grid-template-columns: 1fr; }
  .card{ padding: 32px 24px; }
  .wrap{ padding: 60px 20px 80px; }
  .header{ margin-bottom: 60px; }
  h1{ font-size: clamp(32px, 10vw, 48px); }
  .buttons{ flex-direction: column; }
  .btn{ width: 100%; }
  .care-choice{ 
    flex-direction: column; 
    gap: 16px;
    padding: 24px;
  }
  .care-right{ 
    text-align: left;
    min-width: auto;
  }
  .hero-image{
    height: 300px;
    margin-top: 30px;
  }
}
