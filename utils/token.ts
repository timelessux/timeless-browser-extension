export async function getToken() {
  const token = await chrome.storage.local.get(["timelessAccess", "timelessRefresh"]);

  return {
    refreshToken: token.timelessRefresh,
    accessToken: token.timelessAccess,
  };
}

export async function hasToken() {
  const token = await chrome.storage.local.get(["timelessAccess"]);
  return token.timelessAccess ? true : false;
}

export async function deleteToken() {
  chrome.storage.local.remove(["timelessAccess", "timelessRefresh"], function () {
    const error = chrome.runtime.lastError;
    if (error) {
      console.error(error);
    }
  });
}

export async function setToken(access: string, refresh: string) {
  await chrome.storage.local.set({ timelessAccess: access });
  await chrome.storage.local.set({ timelessRefresh: refresh });
}

export async function setLoggedIn(flag: boolean) {
  await chrome.storage.local.set({ isLoggedIn: flag });
}
