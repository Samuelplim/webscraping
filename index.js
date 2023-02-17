const puppeteer = require("puppeteer");
require("dotenv").config();

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized"],
  });

  const page = await browser.newPage();
  await page.goto(process.env.URL_LINK);

  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', process.env.EMAIL, { delay: 10 });
  await page.waitForSelector('input[name="senha"]');

  await page.type('input[name="senha"]', process.env.PASSWORD, { delay: 10 });

  await page.click('button[id="entrar"]');
  await page.waitForTimeout(2000);

  let checarseentrou = await page.evaluate(() => {
    let res = document.querySelectorAll(
      'div[id="menu76420e3e2ec10bca79d6bfcc6356354c"]'
    );
    if (res.length === 0) {
      return false;
    }
    return true;
  });
  if (checarseentrou === false) {
    await page.click('button[id="entrar"]');
  }
  await page.waitForTimeout(5000);
  await page.click('div[id="menu76420e3e2ec10bca79d6bfcc6356354c"]');

  await page.waitForTimeout(2000);
  await page.click(
    'div[id="grupo_menu76420e3e2ec10bca79d6bfcc6356354c"] li:nth-child(2) a:nth-child(1)'
  );

  await page.waitForTimeout(2000);
  await page.type('input[name="departamento"]', "SUPORTE N", {
    delay: 10,
  });
  await page.click('input[id="origem_H"]');
  await page.click('input[value="OK"]');
  await page.waitForTimeout(5000);
  await page.click('i[title="Último"]');
  await page.waitForTimeout(5000);

  let quantidadeDeChamadoPorCiclo = await page.evaluate(() => {
    return document.querySelectorAll('table[id="grid_1"] tr').length;
  });
  while (quantidadeDeChamadoPorCiclo > 0) {
    for (let index = 0; index < quantidadeDeChamadoPorCiclo; index++) {
      await page.click('div[class="button_print"]');
      await page.click('ul[class="ul_print"] li:nth-child(2)');

      await page.waitForTimeout(1000);

      await page.type(
        'textarea[name="mensagem"]',
        "FINALIZADO POR TEMPO DE ABERTURA",
        {
          delay: 10,
        }
      );
      await page.select('select[id="su_status"]', "S");
      await page.click('button[title="Alt+S"]');
      await page.waitForTimeout(1000);
      await page.click('i[title="Atualizar"]');
      await page.waitForTimeout(5000);
    }

    await page.click('i[title="Último"]');
    await page.waitForTimeout(1000);
    quantidadeDeChamadoPorCiclo = await page.evaluate(() => {
      return document.querySelectorAll('table[id="grid_1"] tr').length;
    });
  }
  await page.screenshot({ path: "result.png" });
  await page.click('i[class="fa fa-sign-out fa-lg"]');
  await browser.close();
})();
