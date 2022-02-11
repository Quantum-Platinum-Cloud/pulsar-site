const fs = require("fs");
const path = require("path");

function _log(msg) {
  if (typeof require !== "undefined" && require.main === module) {
    console.log(msg);
  }
}

const _search = (dir, version, docsId, reg) => {
  let pathname = path.join(dir, docsId + ".md");
  if (fs.existsSync(pathname)) {
    let data = fs.readFileSync(pathname, "utf8");
    if (reg.test(data)) {
      _log("[" + version + ":" + docsId + "]fund: " + pathname);
      return pathname;
    }
  }
  let docsList = fs.readdirSync(dir);
  for (let filename of docsList) {
    let pathname = path.join(dir, filename);
    if (fs.statSync(pathname).isDirectory()) {
      continue;
    }
    if (!pathname.endsWith(".md")) {
      continue;
    }
    let data = fs.readFileSync(pathname, "utf8");
    if (reg.test(data)) {
      _log("[" + version + ":" + docsId + "]fund: " + pathname);
      return pathname;
    }
  }
  return null;
};

const find = (version, docsId) => {
  let vReg = new RegExp("id:\\s*version-(\\d\\.?)+-(incubating-)?" + docsId);
  let nextReg = new RegExp("id:\\s*" + docsId);

  let version_full = "version-" + version;
  let src = "../../../website/versioned_docs/" + version_full;
  if (version == "next") {
    src = "../../../docs";
  }
  src = path.join(__dirname, src);
  nextDir = path.join(__dirname, "../../../docs");
  vDocsDir = path.join(__dirname, "../../../website/versioned_docs");

  let pathname = _search(
    src,
    version,
    docsId,
    version == "next" ? nextReg : vReg
  );
  if (pathname || version == "next") {
    return pathname;
  }

  if (!pathname) {
    _log("[" + version + ":" + docsId + "]not fund, will auto fix missing");
    pathname = _search(nextDir, version, docsId, nextReg);
    if (!pathname) {
      let vDocsDirList = fs.readdirSync(vDocsDir);
      vDocsDirList = vDocsDirList.sort((a, b) => {
        let aVersion = /((\d\.?)+)/.exec(a)[1];
        let bVersion = /((\d\.?)+)/.exec(b)[1];
        aVersion = parseInt(aVersion.replace(/\./g, ""));
        bVersion = parseInt(bVersion.replace(/\./g, ""));
        return bVersion - aVersion;
      });
      for (let vDir of vDocsDirList) {
        pathname = _search(path.join(vDocsDir, vDir), version, docsId, vReg);
        if (pathname) {
          break;
        }
      }
    }
  }

  let log = "{}";
  let logdir = path.join(__dirname, "../log");
  let logpath = path.join(__dirname, "../log", version + ".missing");
  if (!fs.existsSync(logdir)) {
    fs.mkdirSync(logdir);
  }
  if (fs.existsSync(logpath)) {
    log = fs.readFileSync(logpath, "utf8");
  }
  log = JSON.parse(log);
  log[docsId] = pathname ? pathname : "";
  fs.writeFileSync(path.join(logpath), JSON.stringify(log));

  if (!pathname) {
    _log("[" + version + ":" + docsId + "]not fund and fix missing fail");
  }

  return pathname;
};

module.exports = find;

//Test
if (typeof require !== "undefined" && require.main === module) {
  find("2.6.0", "adaptors-kafka");
}
