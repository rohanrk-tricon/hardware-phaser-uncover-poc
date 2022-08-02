/* eslint import/prefer-default-export: off, import/no-mutable-exports: off */
import { URL } from 'url';
import path from 'path';

export let resolveHtmlPath: (htmlFileName: string) => string;

/**
 * While packaging the application make sure the below statement should run 'else' condition,
 * While serving the application make sure the below statement should run 'if' condition.
 * While serving the application check the 'if' condition by replacing the NODE_ENV in which you want to serve.
 * For packaging, we cannot use localhost so we need to point it to a folder with the built version of our app by using file protocol.
 * */
if (process.env.NODE_ENV === 'development') {
  const port = process.env.PORT || 1212;
  resolveHtmlPath = (htmlFileName: string) => {
    const url = new URL(`http://localhost:${port}`);
    url.pathname = htmlFileName;
    return url.href;
  };
} else {
  resolveHtmlPath = (htmlFileName: string) => {
    return `file://${path.resolve(__dirname, '../renderer/', htmlFileName)}`;
  };
}
