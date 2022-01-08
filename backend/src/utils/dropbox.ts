// Downloaders for DB from dropbox on each application start (for Heroku remote filesystem)
import fs from "fs";
const dropboxV2Api = require("dropbox-v2-api");

const downloadFileFromDropbox = async (
  dropboxPath: string,
  writePath: string
): Promise<void> => {
  // create session ref:
  const dropbox = dropboxV2Api.authenticate({
    token: process.env.DROPBOX_TOKEN,
  });

  return new Promise((resolve) => {
    dropbox({
      resource: "files/download",
      parameters: {
        path: dropboxPath,
      },
    })
      .pipe(fs.createWriteStream(writePath))
      .on("finish", resolve);
  });
};

export const downloadStorage = async (): Promise<void[]> => {
  return Promise.all([
    downloadFileFromDropbox(
      "/json_db/dev_movies.json",
      process.env.MOVIE_DB_PATH as string
    ),
    downloadFileFromDropbox(
      "/json_db/people.json",
      process.env.PEOPLE_DB_PATH as string
    ),
    downloadFileFromDropbox(
      "/json_db/genres.json",
      process.env.GENRES_DB_PATH as string
    ),
    downloadFileFromDropbox(
      "/json_db/keywords.json",
      process.env.KEYWORDS_DB_PATH as string
    ),
  ]);
};
