const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function capture(url, outPath, actions = null) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9222;
  
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1920,1080',
    '--disable-gpu',
    '--no-sandbox',
  ]);

  await new Promise((res) => setTimeout(res, 1200));

  try {
    const targetsRes = await fetch(`http://127.0.0.1:${port}/json/new?${url}`, { method: 'PUT' });
    const target = await targetsRes.json();
    const wsUrl = target.webSocketDebuggerUrl;

    const ws = new WebSocket(wsUrl);
    await new Promise((res) => (ws.onopen = res));

    let id = 1;
    function send(method, params = {}) {
      return new Promise((res) => {
        const curId = id++;
        const handler = (event) => {
          const msg = JSON.parse(event.data);
          if (msg.id === curId) {
            ws.removeEventListener('message', handler);
            res(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: curId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url });
    
    await new Promise((res) => setTimeout(res, 3500));

    if (actions) {
      await send('Runtime.evaluate', { expression: actions });
      await new Promise((res) => setTimeout(res, 2000));
    }

    const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log('Saved:', outPath);

    ws.close();
  } catch (err) {
    console.error('Error:', err);
  } finally {
    chrome.kill();
  }
}

async function run() {
  const dir = 'C:\\Users\\didac\\.gemini\\antigravity\\brain\\fc28928b-3549-45b7-8415-2fb1dd7e841b';
  // 1. Dark theme
  await capture('http://localhost:3000/live-timing', `${dir}\\screenshot_dark.png`, `
    const btns = Array.from(document.querySelectorAll('button'));
    const darkBtn = btns.find(b => b.title === 'Dark Tactical' || b.innerHTML.includes('lucide-moon'));
    if (darkBtn) darkBtn.click();
  `);

  // 2. Map-focus / Cinema view
  await capture('http://localhost:3000/live-timing', `${dir}\\screenshot_cinema.png`, `
    const select = document.querySelector('select');
    if (select) {
      select.value = 'map-focus';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  `);

  // 3. Timing Grid focus view
  await capture('http://localhost:3000/live-timing', `${dir}\\screenshot_timing_focus.png`, `
    const select = document.querySelector('select');
    if (select) {
      select.value = 'table-focus';
      select.dispatchEvent(new Event('change', { bubbles: true }));
    }
  `);
}

run();
