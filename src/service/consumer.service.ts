import puppeteer, { Browser, Page } from "puppeteer";
import { consumerInterface } from "../interface/consumer.interface";
import dotenv from "dotenv";
dotenv.config();

class consumerServices {
  browser = new Browser();
  page = new Page();
  url = process.env.URL_LINK || "";
  msSmall = 2000;
  msMeddium = 3000;
  msLarge = 5000;
  msLogin = 10000;
  msg = "FINALIZADO POR TEMPO DE ABERTURA";

  private sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  constructor() {}
  async run() {
    this.browser = await puppeteer.launch({
      headless: false,
      defaultViewport: null,
      userDataDir: "dist/myData",
      args: ["--start-maximized"],
    });
    this.page = (await this.browser.pages())[0];
    await this.page.goto(this.url);
    await this.login();
    await this.abrirPainelDeAtendimentos();
    await this.fecharAtendimentos();
    console.log("Parece que os atendimentos acabaram");
  }

  async login() {
    await this.page.waitForSelector(consumerInterface.iptEmail);
    await this.page.waitForSelector(consumerInterface.iptSenha);
    await this.page.type(consumerInterface.iptEmail, process.env.EMAIL || "", {
      delay: 10,
    });
    await this.page.type(
      consumerInterface.iptSenha,
      process.env.PASSWORD || "",
      {
        delay: 10,
      }
    );
    await this.page.click(consumerInterface.btnEntrar);

    await this.sleep(this.msLogin);
    const checkentro = await this.checarSeEntrou();
    if (!checkentro) {
      await this.page.click(consumerInterface.btnEntrar);
    }
  }

  async abrirPainelDeAtendimentos() {
    const checkentro = await this.checarSeEntrou();
    if (!checkentro) {
      await this.sleep(this.msLarge);
    }
    await this.page.click(consumerInterface.menuID);
    await this.sleep(this.msSmall);
    await this.page.click(consumerInterface.aMenuID);
    await this.sleep(this.msSmall);
    await this.page.type(consumerInterface.iptDepartament, "SUPORTE N", {
      delay: 10,
    });
    await this.page.click(consumerInterface.iptOrigem);
    await this.page.click(consumerInterface.iptOK);
    await this.sleep(this.msLarge);
    await this.page.click(consumerInterface.iUltimo);
    await this.sleep(this.msLarge);
  }

  async fecharAtendimentos() {
    let temAtendimento = await this.checarSeTemAtendimento();
    if (temAtendimento) {
      await this.page.click(consumerInterface.btnPrint);
      await this.page.click(consumerInterface.liPrint);
      await this.sleep(this.msSmall);
      await this.page.type('textarea[name="mensagem"]', this.msg, {
        delay: 10,
      });
      await this.page.select(consumerInterface.iptStatus, "S");
      await this.page.click(consumerInterface.btnAlt);
      await this.sleep(this.msSmall);
      await this.page.click(consumerInterface.iAtual);
      await this.sleep(this.msSmall);
      const temAtendimentoPosfechar = await this.checarSeTemAtendimento();
      if (temAtendimentoPosfechar) {
        await this.fecharAtendimentos();
      } else {
        await this.page.click(consumerInterface.iUltimo);
        await this.sleep(this.msLarge);
        const temAtendimentoPosfechar = await this.checarSeTemAtendimento();
        if (temAtendimentoPosfechar) {
          await this.fecharAtendimentos();
        }
      }
    } else {
      await this.sleep(this.msLarge);
      const temAtendimentoPosfechar = await this.checarSeTemAtendimento();
      if (temAtendimentoPosfechar) {
        await this.fecharAtendimentos();
      }
    }
  }

  async checarSeTemAtendimento(): Promise<boolean> {
    const temAtendimento = await this.page.evaluate(() => {
      return document.querySelectorAll('table[id="grid_1"] tr').length > 0
        ? true
        : false;
    });
    return temAtendimento;
  }

  async checarSeEntrou(): Promise<boolean> {
    const checkEntrou = await this.page.evaluate(() => {
      const componetMenu = document.querySelectorAll(
        'div[id="menu76420e3e2ec10bca79d6bfcc6356354c"]'
      );
      if (componetMenu.length === 0) {
        return false;
      }
      return true;
    });
    return checkEntrou;
  }

  //Fim class
}
export default consumerServices;
