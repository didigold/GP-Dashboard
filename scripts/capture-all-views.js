const { spawn } = require('child_process');
const fs = require('fs');

async function captureView(url, outPath, evaluateFn) {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const port = 9222;
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    '--window-size=1920,1080',
    '--no-sandbox',
  ]);

  await new Promise((res) => setTimeout(res, 1200));

  try {
    const targetsRes = await fetch(`http://127.0.0.1:${port}/json/new?${url}`, { method: 'PUT' });
    const target = await targetsRes.json();
    const ws = new WebSocket(target.webSocketDebuggerUrl);
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
    await new Promise((res) => setTimeout(res, 5000));

    if (evaluateFn) {
      await send('Runtime.evaluate', { expression: `(${evaluateFn.toString()})()` });
      await new Promise((res) => setTimeout(res, 3500));
    }

    const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log('SUCCESS_CAPTURED:', outPath);

    ws.close();
  } catch (e) {
    console.error('Error:', e);
  } finally {
    chrome.kill();
  }
}

async function run() {
  const dir = 'C:\\Users\\didac\\.gemini\\antigravity\\brain\\fc28928b-3549-45b7-8415-2fb1dd7e841b';

  // 1. Cinema / Map Focus
  await captureView('http://localhost:3000/live-timing', `${dir}\\view_cinema_map_focus.png`, () => {
    const btns = Array.from(document.querySelectorAll('button'));
    const menuBtn = btns.find(b => b.innerText.includes('Cockpit View') || b.innerText.includes('Layout'));
    if (menuBtn) {
      menuBtn.click();
      setTimeout(() => {
        const cinemaBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Cinema / Map Focus'));
        if (cinemaBtn) cinemaBtn.click();
      }, 300);
    }
  });

  // 2. Timing Grid Focus
  await captureView('http://localhost:3000/live-timing', `${dir}\\view_timing_grid_focus.png`, () => {
    const btns = Array.from(document.querySelectorAll('button'));
    const menuBtn = btns.find(b => b.innerText.includes('Cockpit View') || b.innerText.includes('Layout'));
    if (menuBtn) {
      menuBtn.click();
      setTimeout(() => {
        const timingBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Timing Grid Focus'));
        if (timingBtn) timingBtn.click();
      }, 300);
    }
  });

  // 3. Onboard 3D Cockpit View
  await captureView('http://localhost:3000/live-timing', `${dir}\\view_onboard_cockpit.png`, () => {
    const btns = Array.from(document.querySelectorAll('button'));
    const onboardBtn = btns.find(b => b.innerText.includes('Onboard'));
    if (onboardBtn) onboardBtn.click();
  });
}

run();
