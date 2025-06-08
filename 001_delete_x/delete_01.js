const PARAMETROS = {
  language: "es",
  userName: "@YoSoloYoYmiPers",
  ancestor: 6,
  colors: {
    col_post_01: "yellow",
    col_post_02: "red",
  },
  buscar: {
    post_elim_caret: `'button[data-testid="caret"]'`,
    post_dele_caret: `'div[data-testid="Dropdown"]'`,
    post_to_retweet: `'button[data-testid="retweet"]'`, //Encontrar los que tienen data-testid="retweet"
  },
  textToSearch: {
    es: "Eliminar",
    en: "Delete",
  },
  eliminPost: {
    scrollNumber: 3,
  },
};

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

function listOfElementToSearch({ searchCase }) {
  if (searchCase === 1) {
    const elementsToSearch = document.querySelectorAll(
      'button[data-testid="caret"]'
    );
    if (elementsToSearch) {
      return elementsToSearch;
    }
  } else if (searchCase === 2) {
    const elementsToSearch = document.querySelectorAll(
      'div[data-testid="Dropdown"]'
    );
    if (elementsToSearch) {
      return elementsToSearch;
    }
  } else if (searchCase === 3) {
    const elementsToSearch = document.querySelectorAll(
      'button[data-testid="confirmationSheetConfirm"]'
    );
    if (elementsToSearch) {
      return elementsToSearch;
    }
  } else if (searchCase === 4) {
    const elementsToSearch = document.querySelectorAll(
      'div[data-testid="cellInnerDiv"]'
    );
    if (elementsToSearch) {
      return elementsToSearch;
    }
  } else if (searchCase === 5) {
    const elementsToSearch = document.querySelectorAll(
      'div[data-testid="unretweetConfirm"]'
    );
    if (elementsToSearch) {
      return elementsToSearch;
    }
  } else if (searchCase === 6) {
    //data-testid="retweetConfirm"
    const elementsToSearch = document.querySelectorAll(
      'div[data-testid="retweetConfirm"]'
    );
    if (elementsToSearch) {
      return elementsToSearch;
    }
  }

  return null;
}

async function findUserCaretArray(
  params = { language, userName, ancestor, color }
) {
  let canContinue = false;
  const elementsCellInnerDiv = listOfElementToSearch({ searchCase: 4 });
  if (!elementsCellInnerDiv) {
    return canContinue;
  }
  // debugger;
  try {
    for (const CellInnerDiv of elementsCellInnerDiv) {
      let text = CellInnerDiv.textContent;
      if (text) {
        if (text.includes(params.userName)) {
          // Es un Post
          console.log("User name is: ", text);
          const elementsCaret = CellInnerDiv.querySelectorAll(
            'button[data-testid="caret"]'
          );
          if (!elementsCaret) {
            return canContinue;
          }
          elementsCaret[0].style.backgroundColor = params.color;
          console.log(elementsCaret[0]);

          await ejecuteDelete({
            userCaret: elementsCaret[0],
            language: params.language,
          });
          await wait(1000);
        } else if (text.includes("Reposteaste")) {
          // Puede ser Reposteaste
          console.clear();
          console.log(CellInnerDiv);
          console.log("Reposteaste?: ", text);
          const elementsButtonUnRetweet = CellInnerDiv.querySelectorAll(
            'button[data-testid="unretweet"]'
          );
          if (!elementsButtonUnRetweet) {
            return canContinue;
          }
          elementsButtonUnRetweet[0].style.backgroundColor = params.colors;
          console.log(elementsButtonUnRetweet[0]);

          canContinue = await ejecutaDeleteRetweets({
            unRetweet: elementsButtonUnRetweet[0],
            language: params.language,
          });
          await wait(1000);
        }
      } else {
        // Si no pertenece quiero poner en 0 ese elemento.
        console.clear();
        console.log(CellInnerDiv);
        console.log("no tiene text ");
      }
      canContinue = true;
    }
  } catch (error) {
    canContinue = false;
    console.error(error);
    // return canContinue;
  }

  return canContinue;
}

async function ejecutaDeleteRetweets(params = { unRetweet, language }) {
  let canContinue = false;

  try {
    console.log(`Eliminando retweet`);
    console.log(params.unRetweet);

    params.unRetweet.click();
    await wait(3000);

    let elementsUnRetweetConfirm = listOfElementToSearch({ searchCase: 5 });
    if (!elementsUnRetweetConfirm) {
      return 0;
    }
    console.log(elementsUnRetweetConfirm);
    for (const c of elementsUnRetweetConfirm) {
      console.log(c);
      c.style.backgroundColor = params.color;
      c.click();
      await wait(3000);
    }
    canContinue = true;
  } catch (error) {
    canContinue = false;
    console.error(error);
  }
  return canContinue;
}

async function ejecuteDelete(params = { userCaret, language }) {
  if (params.language === "es") {
    textToSearch = PARAMETROS.textToSearch.es;
  } else {
    textToSearch = PARAMETROS.textToSearch.en;
  }

  //debugger;
  params.userCaret.click();
  await wait(1000);

  let elementsToSearch = listOfElementToSearch({ searchCase: 2 });
  if (!elementsToSearch) {
    return 0;
  }

  for (const c of elementsToSearch) {
    //console.log(c);
    //debugger;
    const existingText =
      c.firstChild.getElementsByTagName("div")[1].firstChild.firstChild
        .innerText;
    if (existingText.toLowerCase() === textToSearch.toLowerCase()) {
      c.firstChild.click();
      await wait(1000);
      elementsToSearch = listOfElementToSearch({ searchCase: 3 });
      if (!elementsToSearch) {
        return 0;
      }
      for (const e of elementsToSearch) {
        //console.log(e);
        e.click();
      }
    }
  }

  await wait(2000);
}

function Confirmar({ confirmarCase }) {
  let text = "";
  if (confirmarCase === "Continuar") {
    text = "¿Desea continuar?";
  }
  if (confirm(text) == true) {
    return 1;
  }
  return 0;
}

async function eliminaPosts(params = { language, userName, ancestor }) {
  let canContinue = true;
  let counter = 0;

  while (canContinue) {
    canContinue = await findUserCaretArray({
      ...params,
      colors: PARAMETROS.colors.col_post_01,
    });
    // return 0;
    // debugger;
    if (counter === PARAMETROS.eliminPost.scrollNumber) {
      let wantContinue = Confirmar({ confirmarCase: "Continuar" });
      if (wantContinue === 1) {
        counter = 0;
      } else {
        canContinue = false;
        location.reload();
        return 1;
      }
    }
    window.scrollTo(0, document.body.scrollHeight);
    console.log("---------------");
    console.log("---scroll--- para counter --- ", counter);
    console.log("---------------");
    await wait(10000);

    counter++;
  }
  return 1;
}

async function doRetweet(params = { language, userName, ancestor }) {
  let canContinue = true;
  let counter = 0;

  while (canContinue) {
    canContinue = await findUserCaretArrayToRetweet({
      ...params,
      colors: PARAMETROS.colors.col_post_02,
    });
    // return 0;
    // debugger;
    if (counter === PARAMETROS.eliminPost.scrollNumber) {
      let wantContinue = Confirmar({ confirmarCase: "Continuar" });
      if (wantContinue === 1) {
        counter = 0;
      } else {
        canContinue = false;
        location.reload();
        return 1;
      }
    }
    window.scrollTo(0, document.body.scrollHeight);
    console.log("---------------");
    console.log("---scroll--- para counter --- ", counter);
    console.log("---------------");
    await wait(10000);

    counter++;
  }
  return 1;
}

async function findUserCaretArrayToRetweet(
  params = { language, userName, ancestor, color }
) {
  let canContinue = false;
  const elementsCellInnerDiv = listOfElementToSearch({ searchCase: 4 });
  if (!elementsCellInnerDiv) {
    return canContinue;
  }
  // debugger;
  try {
    for (const CellInnerDiv of elementsCellInnerDiv) {
      let text = CellInnerDiv.textContent;
      if (text) {
        if (text.includes(params.userName)) {
          // Es un Post
          console.log("User name is: ", text);
        } else if (text.includes("Reposteaste")) {
          // Puede ser Reposteaste
          console.clear();
          console.log(CellInnerDiv);
          console.log("Reposteaste?: ", text);
          const elementsButtonDoRetweet = CellInnerDiv.querySelectorAll(
            'button[data-testid="retweet"]'
          );
          if (!elementsButtonDoRetweet) {
            return canContinue;
          }
          elementsButtonDoRetweet[0].style.backgroundColor = params.colors;
          console.log(elementsButtonDoRetweet[0]);

          canContinue = await ejecutaDoRetweets({
            doRetweet: elementsButtonDoRetweet[0],
            language: params.language,
          });
          await wait(1000);
        }
      } else {
        // Si no pertenece quiero poner en 0 ese elemento.
        console.clear();
        console.log(CellInnerDiv);
        console.log("no tiene text ");
      }
      canContinue = true;
    }
  } catch (error) {
    canContinue = false;
    console.error(error);
    // return canContinue;
  }

  return canContinue;
}

async function ejecutaDoRetweets(params = { doRetweet, language }) {
  let canContinue = false;

  try {
    console.log(`Ejecutando retweet`);
    console.log(params.doRetweet);

    params.doRetweet.click();
    await wait(3000);

    let elementsDoRetweetConfirm = listOfElementToSearch({ searchCase: 6 });
    if (!elementsDoRetweetConfirm) {
      return 0;
    }
    console.log(elementsDoRetweetConfirm);
    for (const c of elementsDoRetweetConfirm) {
      console.log(c);
      c.style.backgroundColor = params.color;
      c.click();
      await wait(3000);
    }
    canContinue = true;
  } catch (error) {
    canContinue = false;
    console.error(error);
  }
  return canContinue;
}

async function main({ i = 1 }) {
  if (i === 1) {
    //removePhotos();
    await removePhotos({ i: 25, j: 0, language: "es" });
  }
  if (i === 2) {
    await eliminaPosts({
      language: PARAMETROS.language,
      userName: PARAMETROS.userName,
      ancestor: PARAMETROS.ancestor,
    });
  }
  if (i === 3) {
    // await removeRetweets({
    //   language: PARAMETROS.language,
    //   userName: PARAMETROS.userName,
    //   ancestor: PARAMETROS.ancestor,
    // });
  }
  if (i === 4) {
    // Los que aparecen como reposts pero sin estarlo, lo que vamos a hacer es
    // volver a hacer repost para luego correr el proceso normal.
    await doRetweet({
      language: PARAMETROS.language,
      userName: PARAMETROS.userName,
      ancestor: PARAMETROS.ancestor,
    });
  }
}

main({ i: 2 });
