import WebApp from "@twa-dev/sdk";

export function useTelegram() {
  return {
    webApp: WebApp,
    initData: WebApp.initData,
    user: WebApp.initDataUnsafe?.user,
  };
}
