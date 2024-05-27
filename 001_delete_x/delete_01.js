function nextPhoto({ photoSecuential = 0, photoGridPos = 0 } = {}) {
  const elemToFind = `verticalGridItem-${photoSecuential}-profile-grid-${photoGridPos}`;
  const elemFinded = document
    .getElementById(elemToFind)
    .getElementsByTagName("a");
  if (!elemFinded) {
    return null;
  }
  return elemFinded[0];
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function findParent({ node, parentNumber = 1 } = {}) {
  let i = 1;
  let parentNode = node.parentNode;

  if (!parentNode) {
    return node;
  }

  while (i < parentNumber) {
    i++;
    parentNode = findParent({ node: parentNode });
  }
  return parentNode;
}

function findUserCaret({
  userName = "@YoSoloYoYmiPers",
  color = "yellow",
  ancestor = 2,
} = {}) {
  let userCaret = null;
  for (const d of document.querySelectorAll('div[data-testid="User-Name"]')) {
    let text = d.textContent;
    if (text) {
      if (text.includes(userName)) {
        //console.log(text);

        let te = findParent({ node: d, parentNumber: ancestor });
        //console.log(te);
        let ta = te.nextElementSibling;
        ta.style.backgroundColor = color;
        //console.log(ta);
        if (ta) {
          userCaret = ta;
        }
      }
    }
  }
  return userCaret;
}

async function findCaretDos({ userCaret, language = "es" } = {}) {
  if (language === "es") {
    textToSearch = "Eliminar";
  } else {
    textToSearch = "Delete";
  }

  //let userCaret = findUserCaret();
  if (!userCaret) {
    return null;
  }
  //debugger;

  for (const d of userCaret.querySelectorAll('button[data-testid="caret"]')) {
    d.click();
    await wait(2000);

    for (const c of document.querySelectorAll('div[data-testid="Dropdown"]')) {
      const existingText =
        c.firstChild.getElementsByTagName("div")[1].firstChild.firstChild
          .innerText;
      if (existingText.toLowerCase() === textToSearch.toLowerCase()) {
        c.firstChild.click();
        await wait(2000);
        for (const e of document.querySelectorAll(
          'button[data-testid="confirmationSheetConfirm"]'
        )) {
          //console.log(e);
          e.click();
        }
      }
    }
  }
}

async function removePhotos({
  i = 60,
  j = 0,
  language = "es",
  userName = "@YoSoloYoYmiPers",
} = {}) {
  let total = i;

  let next = nextPhoto({ photoSecuential: i, photoGridPos: j });
  while (next) {
    next.click();
    next.style.backgroundColor = "yellow";
    await wait(2000);
    //debugger;
    console.log(`Deleting photo ${i} of ${total}`);
    let userCaret = findUserCaret({ userName });
    await findCaretDos({ userCaret, language });
    await wait(2000);
    //debugger;

    i--;
    next = nextPhoto({ photoSecuential: i, photoGridPos: j });

    if (i === 50) {
      next = null; //termina
    }
  }
}

async function findUserCaretArray({
  userName,
  color = "yellow",
  language,
  ancestor,
} = {}) {
  let canContinue = false;
  //debugger;
  for (const d of document.querySelectorAll('button[data-testid="caret"]')) {
    let sixAncestor = findParent({ node: d, parentNumber: ancestor });
    let text = sixAncestor.textContent;
    if (text) {
      if (text.includes(userName)) {
        console.log(text);
        //console.log(d);
        d.style.backgroundColor = color;
        //debugger;
        await ejecuteDelete({ userCaret: d, language });
        await wait(1000);
      }
    }
    canContinue = true;
  }
  return canContinue;
}

async function ejecuteDelete({ userCaret, language = "es" } = {}) {
  if (language === "es") {
    textToSearch = "Eliminar";
  } else {
    textToSearch = "Delete";
  }

  //debugger;
  userCaret.click();
  await wait(1000);

  for (const c of document.querySelectorAll('div[data-testid="Dropdown"]')) {
    //console.log(c);
    //debugger;
    const existingText =
      c.firstChild.getElementsByTagName("div")[1].firstChild.firstChild
        .innerText;
    if (existingText.toLowerCase() === textToSearch.toLowerCase()) {
      c.firstChild.click();
      await wait(1000);
      for (const e of document.querySelectorAll(
        'button[data-testid="confirmationSheetConfirm"]'
      )) {
        //console.log(e);
        e.click();
      }
    }
  }
  await wait(2000);
}

async function eliminaPosts({ language, userName, ancestor } = {}) {
  let canContinue = true;

  while (canContinue) {
    canContinue = await findUserCaretArray({ language, userName, ancestor });
    // debugger;
    window.scrollTo(0, document.body.scrollHeight);
    console.log("---------------");
    console.log("---scroll---");
    console.log("---------------");
    await wait(10000);
  }
  return 1;
}

async function removeRetweets({ language, userName, ancestor } = {}) {
  let canContinue = true;

  while (canContinue) {
    //canContinue = await findUserCaretArray({ language, userName, ancestor });
    //debugger;
    for (const d of document.querySelectorAll(
      'button[data-testid="unretweet"]'
    )) {
      console.log(`Eliminando retweet ${d}`);
      d.style.backgroundColor = "yellow";
      //debugger;
      d.click();
      await wait(3000);
      for (const c of document.querySelectorAll(
        'div[data-testid="unretweetConfirm"]'
      )) {
        c.style.backgroundColor = "yellow";
        c.click();
        await wait(3000);
      }
    }
    //window.scrollTo(0, document.body.scrollHeight);
    console.log("---------------");
    console.log("---scroll---");
    console.log("---------------");
    //await wait(5000);
  }
  return 1;
}

async function main({ i = 1 }) {
  if (i === 1) {
    //removePhotos();
    await removePhotos({ i: 25, j: 0, language: "es" });
  }
  if (i === 2) {
    await eliminaPosts({
      language: "es",
      userName: "@YoSoloYoYmiPers",
      ancestor: 6,
    });
  }
  if (i === 3) {
    await removeRetweets({
      language: "es",
      userName: "@YoSoloYoYmiPers",
      ancestor: 6,
    });
  }
}

main({ i: 2 });
