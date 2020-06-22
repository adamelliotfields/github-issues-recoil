import axios from 'axios';
import parseLinkHeader from 'parse-link-header';

const GITHUB_API_TOKEN = process.env.REACT_APP_GITHUB_API_TOKEN;
const GITHUB_API_REPOS_URL = 'https://api.github.com/repos';
const ISSUES_PER_PAGE = 25;

const axiosConfig =
  typeof GITHUB_API_TOKEN !== 'undefined'
    ? { headers: { Authorization: `token ${GITHUB_API_TOKEN}` } }
    : {};

const axiosInstance = axios.create(axiosConfig);

/**
 * @param {object} pageLinks
 * @returns {boolean}
 */
const isLastPage = (pageLinks) =>
  Object.keys(pageLinks).length === 2 && pageLinks.first && pageLinks.prev;

/**
 * @param {object} pageLinks
 * @returns {number}
 */
const getPageCount = (pageLinks) => {
  if (!pageLinks) return 0;

  const lastPage = isLastPage(pageLinks);

  if (lastPage) return parseInt(pageLinks.prev.page, 10) + 1;

  if (pageLinks.last) return parseInt(pageLinks.last.page, 10);

  return 0;
};

/**
 * @param {string} org
 * @param {string} repo
 * @param {number} page
 * @returns {Promise<object>}
 */
export async function getIssues(org, repo, page) {
  const url = `${GITHUB_API_REPOS_URL}/${org}/${repo}/issues?per_page=${ISSUES_PER_PAGE}&page=${page}`;
  // We want errors to be caught by our Error Boundary components, so we won't be catching here.
  const { headers, data: issues } = await axiosInstance.get(url);
  const pageLinks = parseLinkHeader(headers.link);

  let pageCount = 0;

  if (pageLinks !== null) {
    pageCount = getPageCount(pageLinks);
  }

  return {
    pageLinks,
    pageCount,
    issues,
  };
}

/**
 * @param {string} org
 * @param {string} repo
 * @returns {Promise<object>}
 */
export async function getRepoDetails(org, repo) {
  const url = `${GITHUB_API_REPOS_URL}/${org}/${repo}`;
  const { data } = await axiosInstance.get(url);
  return data;
}

/**
 * @param {string} url
 * @returns {Promise<object>}
 */
export async function getComments(url) {
  const { data } = await axiosInstance.get(url);
  return data;
}
