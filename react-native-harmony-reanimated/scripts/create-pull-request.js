// @ts-check
const { execSync } = require('child_process');
const fs = require('node:fs');
const readline = require('readline');
const config  = require("./config.js")

const packageJson = JSON.parse(
  fs.readFileSync('./package.json').toString()
)


const {OWNER,EXPECTED_EXECUTION_DIRECTORY_NAME,MODULE_NAME} = config


const GITHUB_URL = 'https://api.github.com';
const GITEE_URL = 'https://gitee.com/api/v5';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function createPullRequest() {
  
  const merge_Request_html_url = await createMergeRequest(
    `release-${EXPECTED_EXECUTION_DIRECTORY_NAME}-${packageJson['version']}`,
    `release: ${EXPECTED_EXECUTION_DIRECTORY_NAME}@${packageJson['version']}`
  );
  console.log(`Please merge the following Merge Request:\n${merge_Request_html_url}`);
   
  rl.question(
    'is the following Merge Request merged? (yes/no): ',
    async (answer) => {
      if (answer.toLowerCase() === 'yes') {
        // execSync(`npm publish`, { stdio: 'inherit' });
        const release_Request_html_url = await createReleaseRequest();
        console.log(`Please create the following release Request:\n${release_Request_html_url}`);

        rl.close();
      } else {
        console.log('Deployment aborted.');
        rl.close();
      }
    }
  ); 


  // getGitRemoteUrl().indexOf('github')?
  // const sss = ` https://gitee.com/wangyue6/npmtest_rnmarquee/releases/tag/v0.6.13`
  // console.log(`Please send the following Tag Request:\n${merge_Request_html_url}`);
  // rl.close();      
}


/**
 * @param {string} sourceBranch
 * @param {string} title
 * @returns {Promise<number>}
 */
async function createGitHubMergeRequest(sourceBranch, title) {
  try {
    const RNOH_REPO_TOKEN = process.env.GITHUB_TOKEN ?? '';
    console.log('createGitHubMergeRequest', sourceBranch)

    if (!RNOH_REPO_TOKEN) {
    console.log('RNOH_REPO_TOKEN not found');
    process.exit(1);
    }
    const response = await fetch(
      `${GITHUB_URL}/repos/${OWNER}/${EXPECTED_EXECUTION_DIRECTORY_NAME}/pulls`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${RNOH_REPO_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          'head': `${sourceBranch}`, // 当前分支
          'base': `sig` // 目标分支
        }),
      }
    );
    if (!response.ok) {
      throw new Error(
        `Failed to create merge request: ${response.statusText} ${response.status}`
      );
    }
    const responseData = await response.json();
    console.log(JSON.stringify(responseData))
    return responseData.html_url;
  } catch (error) {
    console.error('Error creating merge request:', error);
    throw error;
  }
}
/**
 * @param {any} sourceBranch
 * @param {any} title
 */
async function createGiteeMergeRequest(sourceBranch, title) {
  try {
    const RNOH_REPO_TOKEN = process.env.GITEE_TOKEN ?? '';
    if (!RNOH_REPO_TOKEN) {
      console.log('RNOH_REPO_TOKEN not found');
      process.exit(1);
    }
    const response = await fetch(
      `${GITEE_URL}/repos/${OWNER}/${EXPECTED_EXECUTION_DIRECTORY_NAME}/pulls`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${RNOH_REPO_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title,
          owner:OWNER,
          repo: EXPECTED_EXECUTION_DIRECTORY_NAME,
          'head': `${sourceBranch}`, // fork仓库分支
          'base': `master` // 源仓库分支
        }),
      }
    );
    const responseData = await response.json();
    console.log(JSON.stringify(responseData))
    return responseData.html_url;
  } catch (error) {
    console.error('Error creating merge request:', error);
    throw error;
  }
}
function getGitRemoteUrl() {
  try {
    // 执行git命令获取远程仓库地址
    const stdout = execSync('git config --get remote.origin.url', { encoding: 'utf8' });
    return stdout.trim(); // 去除字符串两端的空格和换行符
  } catch (error) {
    console.error('Error while getting git remote URL:', error);
    return "";
  }
}

/**
 * @param {string} sourceBranch
 * @param {string} title
 */
function createMergeRequest(sourceBranch, title) {
  let remoteUrl = getGitRemoteUrl()
  return remoteUrl?.indexOf('github')>-1?createGitHubMergeRequest(sourceBranch, title):
          remoteUrl.indexOf('gitee')>-1?createGiteeMergeRequest(sourceBranch, title):''  
}
/**
 */
function createReleaseRequest() {
  let remoteUrl = getGitRemoteUrl()
  return remoteUrl?.indexOf('github')>-1?createGitHubReleaseRequest():
          remoteUrl.indexOf('gitee')>-1?createGiteeReleaseRequest():''  
}

/**
 * @returns {Promise<number>}
 */
async function createGitHubReleaseRequest() {
  try {
    const RNOH_REPO_TOKEN = process.env.GITHUB_TOKEN ?? '';
    console.log('createGitHubReleaseRequest')

    if (!RNOH_REPO_TOKEN) {
    console.log('RNOH_REPO_TOKEN not found');
    process.exit(1);
    }
    const response = await fetch(
      `${GITHUB_URL}/repos/${OWNER}/${EXPECTED_EXECUTION_DIRECTORY_NAME}/releases`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${RNOH_REPO_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "tag_name": `v${packageJson['version']}`,
          "name": `v${packageJson['version']}`,
          "body": "This is the body of the release",
          "draft": false,
          "prerelease": false
        }),
      }
    );
    if (!response.ok) {
      const responseData = await response.json();
      console.log(JSON.stringify(responseData))
      throw new Error(
        `Failed to create release request: ${response.statusText} ${response.status}`
      );
    }
    const responseData = await response.json();
    console.log(JSON.stringify(responseData))
    return responseData.html_url;
  } catch (error) {
    console.error('Error creating release request:', error);
    throw error;
  }
}
/**
 * @returns {Promise<number>}
 */
async function createGiteeReleaseRequest() {
  try {
    const RNOH_REPO_TOKEN = process.env.GITEE_TOKEN ?? '';
    console.log('createGiteeReleaseRequest')

    if (!RNOH_REPO_TOKEN) {
    console.log('RNOH_REPO_TOKEN not found');
    process.exit(1);
    }
    const response = await fetch(
      `${GITEE_URL}/repos/${OWNER}/${EXPECTED_EXECUTION_DIRECTORY_NAME}/releases`,
      {
        method: 'POST',
        headers: {
          'Authorization': `token ${RNOH_REPO_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "tag_name": `v${packageJson['version']}`,
          "name": `v${packageJson['version']}`,
          "body": "This is the body of the release",
          "draft": false,
          "prerelease": false
        }),
      }
    );
    if (!response.ok) {
      const responseData = await response.json();
      // console.log(JSON.stringify(responseData))
      throw new Error(
        `Failed to create release request: ${response.statusText} ${response.status}`
      );
    }
    const responseData = await response.json();
    // console.log(JSON.stringify(responseData))
    return responseData.html_url;
  } catch (error) {
    console.error('Error creating release request:', error);
    throw error;
  }
}
 

createPullRequest();
