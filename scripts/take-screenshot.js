const { spawn } = require('child_process');
const fs = require('fs');

async function main() {
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
    const targetsRes = await fetch(`http://127.0.0.1:${port}/json/new?http://localhost:3000/live-timing`, { method: 'PUT' });
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
    await send('Page.navigate', { url: 'http://localhost:3000/live-timing' });
    
    // Wait 9 seconds for Next.js on-demand compilation
    await new Promise((res) => setTimeout(res, 9000));

    const shot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true });
    fs.writeFileSync('C:\\Users\\didac\\.gemini\\antigravity\\brain\\fc28928b-3549-45b7-8415-2fb1dd7e841b\\screenshot_check.png', Buffer.from(shot.data, 'base64'));
    console.log('SCREENSHOT_CAPTURED_SUCCESSFULLY');

    ws.close();
  } catch (err) {
    console.error('Error taking screenshot:', err);
  } finally {
    chrome.kill();
  }
}

main();
