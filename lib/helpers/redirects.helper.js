import Router from "next/router";

export const redirectWithDelay = (delay, url) => {
  const delayInSeconds = delay * 1000;

  setTimeout(() => {
    Router.push(url);
  }, delayInSeconds);
};
