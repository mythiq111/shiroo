export function renderGatePage(error: boolean): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Happy Birthday Shirooo</title>
<style>
  * { box-sizing: border-box; }
  body {
    margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center;
    font-family: Inter, system-ui, sans-serif; padding: 1.5rem;
    background: linear-gradient(160deg, #f9f5ff, #f3effe);
    color: #2a1535;
  }
  .gate-box {
    background: #fff; border: 1.5px solid rgba(155,132,196,.18); border-radius: 20px;
    padding: 2.4rem 2.2rem; text-align: center; width: min(360px, 90vw);
    box-shadow: 0 20px 60px rgba(155,132,196,.2), 0 4px 16px rgba(212,104,124,.12);
    display: flex; flex-direction: column;
  }
  .gate-emoji { font-size: 2.2rem; margin-bottom: .5rem; }
  .gate-title { font-size: 1.4rem; font-weight: 600; margin-bottom: .3rem; }
  .gate-sub { font-size: .82rem; color: #9b7aaa; font-weight: 300; margin-bottom: 1.4rem; line-height: 1.6; }
  .gate-input {
    width: 100%; padding: .75rem 1rem; border-radius: 12px; border: 1.5px solid rgba(155,132,196,.18);
    background: #fefcff; color: #2a1535; font-size: .9rem; text-align: center; outline: none;
  }
  .gate-input:focus { border-color: #9b84c4; }
  .gate-error { font-size: .78rem; color: #b84f63; margin-top: .6rem; }
  .gate-btn {
    margin-top: 1.2rem; display: inline-flex; align-items: center; justify-content: center; gap: .4rem;
    background: linear-gradient(135deg, #d4687c, #9b84c4); color: #fff; font-size: .82rem; font-weight: 500;
    letter-spacing: .08em; text-transform: uppercase; padding: .75rem 2rem; border-radius: 50px; border: none;
    cursor: pointer; box-shadow: 0 4px 18px rgba(155,132,196,.25);
  }
</style>
</head>
<body>
  <form class="gate-box" method="POST" action="/__unlock">
    <span class="gate-emoji">🔒</span>
    <div class="gate-title">This one's private 💜</div>
    <p class="gate-sub">Enter the password to open your surprise</p>
    <input type="password" name="password" class="gate-input" placeholder="Password" autofocus autocomplete="off" />
    ${error ? '<p class="gate-error">That\'s not it — try again 🥺</p>' : ""}
    <button type="submit" class="gate-btn">Unlock ✨</button>
  </form>
</body>
</html>`;
}
