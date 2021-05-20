const puppeteer = require("puppeteer");
const QueryString = require("./generateQueryString");
const fs = require("fs");

const firstname = "karen",
  lastname = "voigt";

const sites = [
  { site: "PubMed", mainUrl: "https://pubmed.ncbi.nlm.nih.gov/" },
  { site: "PubFacts", mainUrl: "https://www.pubfacts.com/" },
  {
    site: "TrialsJournal",
    mainUrl: "https://trialsjournal.biomedcentral.com/",
  },
];

const searchName = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    ignoreHTTPSErrors: true,
  });

  const page = await browser.newPage();
  const allLinks = [];

  for (const site of sites) {
    const sitename = site.site;
    const sitehome = site.mainUrl;

    const queryString = QueryString(firstname, lastname, sitename);

    await page.goto(queryString);
    await page.waitForTimeout(3000);

    const aTags = await page.evaluate(
      (name, home) => {
        const tags = document.querySelectorAll("body a");
        const links = [];
        const linksWithText = [];
        tags.forEach((tag) => {
          const text = tag.outerText.trim();
          const link = tag.href;

          if (
            text.split(" ").length >= 4 &&
            link.includes(home) &&
            !links.includes(link)
          ) {
            linksWithText.push({
              Link: link,
              Text: text,
              Site: name,
            });
            links.push(link);
          }
        });
        return linksWithText;
      },
      sitename,
      sitehome
    );

    allLinks.push(...aTags);

    console.log(aTags);
  }

  const foldername = `data/${firstname}_${lastname}`;
  if (allLinks.length > 0 && !fs.existsSync(foldername)) {
    fs.mkdirSync(foldername);
  }

  const filename = `${foldername}/${firstname}_${lastname}.json`;
  fs.writeFile(filename, JSON.stringify(allLinks), () => {});

  const linksFile = fs.readFileSync(filename);
  const parsedFile = JSON.parse(linksFile);
  console.log(parsedFile);

  // for (const obj of parsedFile) {
  //   const link = obj.link;
  // }

  await browser.close();
};

searchName();

// check for word length of texts ?
// length 4 -> still unnecessary articles
// length 5 -> some articles are missed
// check whether the link is from the current site or not?
// still different types of unnecessary articles remain.
