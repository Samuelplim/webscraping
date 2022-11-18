const puppeteer = require("puppeteer");
require("dotenv").config();
/**
 * LIB's instaladas
 * cheerio
 * puppeteer
 * axios
 * npm start
 */
//await page.click('table[id="grid_1"] tr:nth-child(1)', { clickCount: 2 }); ABRIR O CHAMADO
/*
  let chamadoASerFechado = await page.evaluate(() => {
    let chamadoAserfechado;
    document
      .querySelectorAll(
        'table[id="grid_1"] tr:nth-child(1) td[abbr="cliente.razao"]'
      )
      .forEach((tite) => (chamadoAserfechado = tite.innerText));
    return chamadoAserfechado;
  });
  */

(async () => {
  console.log("iniciou prossesamento");
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: {
      width: 1000,
      height: 900,
    },
  });

  const page = await browser.newPage();
  await page.goto(process.env.URL_LINK);
  console.log("page UP");

  await page.waitForSelector('input[name="email"]');
  await page.type('input[name="email"]', process.env.EMAIL, { delay: 100 });
  await page.waitForSelector('input[name="senha"]');

  await page.type('input[name="senha"]', process.env.PASSWORD, { delay: 100 });

  await page.keyboard.press("Enter");
  await page.keyboard.press("Enter");
  console.log("Acessando...");

  await page.waitForSelector('div[id="menu76420e3e2ec10bca79d6bfcc6356354c"]');
  await page.click('div[id="menu76420e3e2ec10bca79d6bfcc6356354c"]');

  await page.waitForTimeout(2000); //obrigadorio
  await page.click(
    'div[id="grupo_menu76420e3e2ec10bca79d6bfcc6356354c"] li:nth-child(3) a:nth-child(1)'
  );

  await page.waitForTimeout(2000);
  await page.type('input[name="departamento"]', "SUPORTE N", {
    delay: 100,
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
          delay: 100,
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
  await page.click('i[class="fa fa-sign-out fa-lg"]'); //deslogar
  await browser.close();
  console.log("Finalizado");
})();
