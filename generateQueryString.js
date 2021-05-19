module.exports = (firstname, lastname, site) => {
  const firstnameWords = firstname.split(" ");
  const lastnameWords = lastname.split(" ");

  let nameStr = "";

  firstnameWords.map((word) => (nameStr += word + "+"));
  lastnameWords.map((word) => (nameStr += word + "+"));
  let queryString = "";
  switch (site) {
    case "PubMed":
      queryString = `https://pubmed.ncbi.nlm.nih.gov/?term=${nameStr}`;
      break;

    case "PubFacts":
      queryString = `https://www.pubfacts.com/search/${nameStr}`;
      break;

    case "TrialsJournal":
      queryString = `https://trialsjournal.biomedcentral.com/articles?query=${firstname}+${lastname}&volume=&searchType=&tab=keyword`;
      break;

    case "PubPharm":
      queryString = `https://www.pubpharm.de/vufind/Search/Results?lookfor=${firstname}&limit=10&type=AllFields`;
      break;
  }

  return queryString;
};
