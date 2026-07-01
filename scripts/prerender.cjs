const fs = require("fs");
const path = require("path");
const Prerenderer = require("@prerenderer/prerenderer");
const PuppeteerRenderer = require("@prerenderer/renderer-puppeteer");

const chromeExecutablePath =
  process.env.PUPPETEER_EXECUTABLE_PATH ||
  (fs.existsSync("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe")
    ? "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"
    : undefined);

process.env.PUPPETEER_SKIP_CHROMIUM_DOWNLOAD = "1";

const staticDir = path.join(__dirname, "..", "dist");

const routes = [
  "/",
  "/products",
  "/labs",
  "/blog",
  "/about",
  "/contact",
  "/faq",
  "/shipping-policy",
  "/returns",
  "/warranty",
  "/track-order",
];

async function run() {
  if (!fs.existsSync(staticDir)) {
    throw new Error(`Prerender failed: dist folder not found at ${staticDir}`);
  }

  const prerenderer = new Prerenderer({
    staticDir,
    renderer: new PuppeteerRenderer({
      renderAfterTime: 5000,
      maxConcurrentRoutes: 1,
      executablePath: chromeExecutablePath,
      headless: true,
      timeout: 60000,
      navigationOptions: {
        waituntil: "load",
        timeout: 60000,
      },
      skipThirdPartyRequests: true,
      consoleHandler: (route, message) => {
        console.log(
          `[prerender:${route}] ${message.type()}: ${message.text()}`
        );
      },
    }),
  });

  try {
    await prerenderer.initialize();
    let successCount = 0;
    for (const route of routes) {
      let rendered = false;
      for (let attempt = 1; attempt <= 2; attempt += 1) {
        try {
          const renderedRoutes = await prerenderer.renderRoutes([route]);
          renderedRoutes.forEach((renderedRoute) => {
            const normalizedRoute = renderedRoute.route.replace(/^\/+/, "");
            const outputPath =
              normalizedRoute === ""
                ? path.join(staticDir, "index.html")
                : path.join(staticDir, normalizedRoute, "index.html");

            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, renderedRoute.html.trim(), "utf8");
          });
          successCount += renderedRoutes.length;
          rendered = true;
          break;
        } catch (error) {
          console.error(
            `[prerender] Route failed (attempt ${attempt}): ${route}`,
            error
          );
        }
      }

      if (!rendered) {
        console.error(`[prerender] Giving up on route: ${route}`);
      }
    }

    console.log(
      `[prerender] Rendered ${successCount} routes successfully.`
    );
  } finally {
    prerenderer.destroy();
  }
}

run().catch((error) => {
  console.error("[prerender] Failed:", error);
  process.exit(1);
});
