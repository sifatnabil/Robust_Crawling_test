const puppeteer = require("puppeteer");
const QueryString = require("./generateQueryString");
const fs = require("fs");

const firstname = "karen",
  lastname = "voigt";

const sites = ["PubMed", "PubFacts", "TrialsJournal"];

const searchName = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();

  for (const site of sites) {
    const sitename = site;

    const queryString = QueryString(firstname, lastname, sitename);

    await page.goto(queryString);
    await page.waitForTimeout(8000);

    const aTags = await page.evaluate(() => {
      const tags = document.querySelectorAll("a");
      const links = [];
      tags.forEach((tag) => {
        const text = tag.outerText.trim();
        const link = tag.href;
        if (text.split(" ").length >= 5) {
          links.push({
            Link: link,
            Text: text,
          });
        }
      });
      return links;
    });

    const filename = `data/${firstname}_${lastname}_${sitename}_length5.txt`;

    const file = fs.createWriteStream(filename);
    aTags.forEach((line) => {
      file.write(`${line.Link}, ${line.Text};\n`);
    });
    file.end();

    console.log(aTags);
  }

  await browser.close();
};

searchName();

// check for word length of texts ?
// length 4 -> still unnecessary articles
// length 5 -> some articles are missed
// check whether the link is from the current site or not?
// still different types of unnecessary articles remain.
