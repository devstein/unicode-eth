import fetch from "node-fetch";

export const HEXADECIMAL = 16;

export const range = (length: number, start: number) =>
  [...Array(length).keys()].map((i) => i + start);

export const fetchText = (url: string) =>
  fetch(url).then((resp) => resp.text());
