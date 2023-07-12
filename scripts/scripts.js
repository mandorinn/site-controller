window.onload = (event) => {
  const main = document.querySelector("main");
  const moodPrev = document.getElementById("moodPrev");
  const moodInp = document.getElementById("moodInp");
  const spInp = document.getElementById("spInp");
  const avatarImg = document.getElementById("avaImg");
  const avatarUrl = document.getElementById("avaUrl");
  const avatarArtist = document.getElementById("artist");
  const themeName = document.getElementById("themeName");
  const themeInp = document.getElementById("theme");
  const passwordInp = document.getElementById("password");
  const updateB = document.getElementById("updateButton");
  const userUrl = "https://site-api.fly.dev/data";

  let emojis = {
    softUwU: "webp",
    firShy: "gif",
    firEyes: "webp",
    firNodders: "gif",
    firRip: "webp",
    fir3c: "webp",
    sparkles: "gif",
  };
  function emojifyAndUpdatePreview() {
    const inputValue = moodInp.value;
    const emojifiedValue = inputValue.replace(
      /:([^:\s]+):/g,
      (string, emojiName) => {
        const fileType = emojis[emojiName] || "png";
        return `<span class='emojiCont' emoji_name='${string}'><img src="assets/emojis/${emojiName}.${fileType}"></span>`;
      }
    );
    moodPrev.innerHTML = emojifiedValue;
    return emojifiedValue;
  }
  function artistName(inp) {
    let artistName = inp
      .toString()
      .replace(`_(artist)`, ``)
      .replaceAll(`_`, ` `);
    if (inp == "anonymous_artist") {
      artistName = `anonymous`;
    }
    return artistName;
  }
  async function init() {
    const response = await fetch(userUrl);
    data = await response.json();
    main.setAttribute("site_theme", data.site_theme);
    moodPrev.innerHTML = emojifyAndUpdatePreview();
    moodInp.value = data.mood;
    moodInp.addEventListener("input", emojifyAndUpdatePreview);
    for (let i = 0; i < themeInp.options.length; i++) {
      if (data.site_theme === main.getAttribute("site_theme")) {
        themeInp.value = data.site_theme;
      }
    }
    themeInp.addEventListener("change", function () {
      main.setAttribute("site_theme", themeInp.value);
    });
    spInp.value = data.special_interest;
    avatarImg.src = data.avatar_url;
    themeName.innerText = data.site_theme;
    avatarUrl.href = `https://e621.net/posts/${data.avatar_id}`;
    avatarArtist.innerText = artistName(data.avatar_artist);
  }
  init();
  updateB.onclick = function () {
    let updateUrl = `https://site-api.fly.dev/update?password=${passwordInp.value}`;
    let moodVal = moodInp.value;
    if (moodVal === "") {
      moodVal = data.mood;
    }
    let siVal = spInp.value;
    if (siVal === "") {
      siVal = data.special_interest;
    }
    fetch(updateUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        mood: moodVal,
        special_interest: siVal,
        site_theme: themeInp.value,
      }),
    }).then((response) => {
      moodInp.value = "";
      spInp.value = "";
      if (response.status === 200) {
        alert("Updated!");
      } else {
        alert("Unauthorised, yikesssss");
      }
    });
  };
};
