import assert from "node:assert";
import fromBodyXML from "./index.js";
import Ajv from "ajv";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const transitTreeSchemaFile = fs.readFileSync(
  path.resolve(__dirname, "../../schemas/transit-tree.schema.json")
);

const transitTreeSchema = JSON.parse(transitTreeSchemaFile);

const ajv = new Ajv();

const validate = ajv.compile(transitTreeSchema);
/**
 * Gets the value from an object based on an AJV instancePath.
 *
 * @param {Object} obj - The JSON object to navigate.
 * @param {string} instancePath - The AJV instancePath (e.g., "/body/children/14/type").
 * @returns {*} - The value at the given instancePath, or undefined if the path does not exist.
 */
function getValueAtInstancePath(obj, instancePath) {
  // Split the path into parts, ignoring the leading "/"
  const parts = instancePath.split("/").filter(Boolean);

  // Navigate through the object
  return parts.reduce((acc, key) => {
    // Convert array indices from string to number
    const index = Number(key);
    return acc && !isNaN(index) ? acc[index] : acc?.[key];
  }, obj);
}

async function getNotifications() {
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

  const url = `${process.env.CONTENT_API_HOST}/content/notifications?since=${encodeURIComponent(
    oneHourAgo
  )}`;

  try {
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CONTENT_API_READ_KEY ?? "",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching notifications: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching notifications:", error);
  }
}

async function fetchArticleFromCAPI(apiUrl) {
  try {
    const response = await fetch(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.CONTENT_API_READ_KEY ?? "",
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching ${apiUrl}: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching ${apiUrl}:", error);
  }
}

function getLatestContentURLs(notifications) {
  return Array.from(
    new Set(
      notifications.notifications.map((notification) =>
        notification.apiUrl.replace("/content/", "/internalcontent/")
      )
    )
  );
}

const notifications = await getNotifications();

const apiUrls = getLatestContentURLs(notifications);


for (let apiUrl of apiUrls) {
  test("Validating " + apiUrl.split("/").pop(), async (t) => {
    const article = await fetchArticleFromCAPI(apiUrl);
    if (!article.bodyXML) {
      console.log("No bodyXML");
      t.skip('Skipping - no bodyXML')
      return;
    }

    const bodyTree = fromBodyXML(article.bodyXML);
    const isValid = validate(bodyTree);
    // Add the erroneous value to the error message, for debugging
    if (!isValid) {
      validate.errors.forEach(
        (error) =>
          (error.instanceValue = getValueAtInstancePath(
            bodyTree,
            error.instancePath
          ))
      );
    }
    assert.ok(isValid, `Transit tree is invalid: ${JSON.stringify(validate.errors, null, 2)}`);
  });

}
