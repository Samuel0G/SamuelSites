const fs = require("fs");

async function call(ws, id, method, params = {}) {
  ws.send(JSON.stringify({ id, method, params }));
  return await new Promise((resolve, reject) => {
    const onMessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id === id) {
        ws.removeEventListener("message", onMessage);
        if (data.error) reject(new Error(JSON.stringify(data.error)));
        else resolve(data.result);
      }
    };
    ws.addEventListener("message", onMessage);
  });
}

(async () => {
  const targets = await (await fetch("http://127.0.0.1:9223/json")).json();
  const target =
    targets.find((item) => item.type === "page" && item.url.includes("index.html")) ||
    targets.find((item) => item.type === "page");
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));

  let id = 1;
  await call(ws, id++, "Page.enable");
  await call(ws, id++, "Runtime.enable");
  await call(ws, id++, "Emulation.setDeviceMetricsOverride", {
    width: 390,
    height: 1300,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await call(ws, id++, "Runtime.evaluate", {
    expression: 'window.location.href = "file:///C:/Users/samue/OneDrive/Documentos/Portifolio/index.html"',
  });
  await new Promise((resolve) => setTimeout(resolve, 1000));
  await call(ws, id++, "Runtime.evaluate", {
    expression: 'document.querySelector("#servicos").scrollIntoView({ block: "start" }); window.scrollBy(0, -80);',
  });
  await new Promise((resolve) => setTimeout(resolve, 800));

  const info = await call(ws, id++, "Runtime.evaluate", {
    returnByValue: true,
    expression:
      'JSON.stringify({ innerWidth, scrollWidth: document.documentElement.scrollWidth, bodyScrollWidth: document.body.scrollWidth, cards: [...document.querySelectorAll("#servicos .price-card")].map((item) => item.getBoundingClientRect().toJSON()) })',
  });
  const shot = await call(ws, id++, "Page.captureScreenshot", {
    format: "png",
    captureBeyondViewport: false,
  });
  const output = `${process.env.TEMP}\\portfolio-services-mobile-cdp-final.png`;
  fs.writeFileSync(output, Buffer.from(shot.data, "base64"));
  console.log(info.result.value);
  console.log(output);
  ws.close();
})().catch((error) => {
  console.error(error);
  process.exit(1);
});
